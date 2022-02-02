<template></template>

<script>

import Vue from 'vue';
import Map from 'ol/Map'
import View from 'ol/View'
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom';
import {
  DragAndDrop,
  defaults as defaultInteractions
} from 'ol/interaction';
import RotateControl from 'ol/control/Rotate';
import Projection from 'ol/proj/Projection';
import TileGrid from 'ol/tilegrid/TileGrid';
import { register as olproj4 } from 'ol/proj/proj4';
import { get as getProj } from 'ol/proj';
import { GPX, GeoJSON, IGC, KML, TopoJSON } from 'ol/format';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import proj4 from 'proj4'
// import the app-wide EventBus
import { WguEventBus } from '../../WguEventBus.js';
import { LayerFactory } from '../../factory/Layer.js';
import LayerUtil from '../../util/Layer';
import PermalinkController from './PermalinkController';
import HoverController from './HoverController';
import MapInteractionUtil from '../../util/MapInteraction';
import ViewAnimationUtil from '../../util/ViewAnimation';
import { ColorTheme } from '../../mixins/ColorTheme'

export default {
  name: 'wgu-map',
  mixins: [ ColorTheme ],
  props: {
    collapsibleAttribution: { type: Boolean, default: false },
    rotateableMap: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      zoom: this.$appConfig.mapZoom,
      center: this.$appConfig.mapCenter,
      projection: this.$appConfig.mapProjection,
      projectionObj: null,
      projectionDefs: this.$appConfig.projectionDefs,
      tileGridDefs: this.$appConfig.tileGridDefs || {},
      tileGrids: {},
      permalink: this.$appConfig.permalink,
      mapGeodataDragDop: this.$appConfig.mapGeodataDragDop,
      // mapping format string to OL module / class
      formatMapping: {
        GPX: GPX,
        GeoJSON: GeoJSON,
        IGC: IGC,
        KML: KML,
        TopoJSON: TopoJSON
      },
      dragDropLayerCreated: false
    }
  },
  mounted () {
    var me = this;
    // Make the OL map accessible for Mapable mixin even 'ol-map-mounted' has
    // already been fired. Don not use directly in cmps, use Mapable instead.
    Vue.prototype.$map = me.map;

    me.map.setTarget(document.getElementById('ol-map-container'));

    // Send the event 'ol-map-mounted' with the OL map as payload
    WguEventBus.$emit('ol-map-mounted', me.map);

    // TODO
    //  Re-evaluate whether and if yes which of the following operations have to be deferred.
    //  If so, a better implementation could be to rely on this.$nextTick(), which currently causes trouble
    //  for the units tests (deferred operations are invoked after the component has already been destroyed).
    me.timerHandle = setTimeout(() => {
      // resize the map, so it fits to parent
      me.map.updateSize();

      // adjust the bg color of the OL buttons (like zoom, rotate north, ...)
      me.setOlButtonColor();
    }, 200);
  },
  destroyed () {
    // Send the event 'ol-map-unmounted' with the OL map as payload
    WguEventBus.$emit('ol-map-unmounted', this.map);

    // Destroy controllers, remove map references
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
    if (this.permalinkController) {
      this.permalinkController.tearDown();
      this.permalinkController = undefined;
    }
    if (this.hoverController) {
      this.hoverController.destroy();
      this.hoverController = undefined;
    }
    if (this.map) {
      this.map.getLayers().clear();
      this.map.getInteractions().clear();
      this.map.getControls().clear();
      this.map.getOverlays().clear();
    }
    this.map = undefined;
  },
  created () {
    // make map rotateable according to property
    const interactions = defaultInteractions({
      altShiftDragRotate: this.rotateableMap,
      pinchRotate: this.rotateableMap
    });

    // add geodata drag-drop support according to config
    if (this.mapGeodataDragDop) {
      const dragAndDropInteraction = this.setupGeodataDragDrop();
      interactions.push(dragAndDropInteraction);
    }

    let controls = [
      new Zoom(),
      new Attribution({
        collapsible: this.collapsibleAttribution
      })
    ];
    // add a button control to reset rotation to 0, if map is rotateable
    if (this.rotateableMap) {
      controls.push(new RotateControl());
    }

    // Optional projection (EPSG) definitions for Proj4
    if (this.projectionDefs) {
      // Add all (array of array)
      proj4.defs(this.projectionDefs);
      // Register with OpenLayers
      olproj4(proj4);
    }

    // Projection for map, default is Web Mercator
    let projection;
    if (!this.projection) {
      projection = getProj('EPSG:3857');
    } else {
      projection = new Projection(this.projection);
    }

    // Optional TileGrid definitions by name, for ref in Layers
    Object.keys(this.tileGridDefs).map(name => {
      this.tileGrids[name] = new TileGrid(this.tileGridDefs[name]);
    });

    this.map = new Map({
      layers: [],
      controls: controls,
      interactions: interactions,
      view: new View({
        center: this.center,
        zoom: this.zoom,
        projection: projection
      })
    });

    // create layers from config and add them to map
    this.registerLayerEvents();
    const layers = this.createLayers();
    this.map.getLayers().extend(layers);

    this.hoverController = this.createHoverController();

    if (this.$appConfig.permalink) {
      this.permalinkController = this.createPermalinkController();
      this.map.set('permalinkcontroller', this.permalinkController, true);
      this.permalinkController.apply();
      this.permalinkController.setup();
    }
  },

  methods: {
    /**
     * Creates the OL layers due to the "mapLayers" array in app config.
     * @return {ol.layer.Base[]} Array of OL layer instances
     */
    createLayers () {
      const me = this;
      let layers = [];
      const appConfig = this.$appConfig;
      const mapLayersConfig = appConfig.mapLayers || [];
      mapLayersConfig.reverse().forEach(function (lConf) {
        // Some Layers may require a TileGrid object
        // Remarks: Passing null instead of undefined as parameters into the
        //  constructor of OpenLayers sources overwrites OpenLayers defaults.
        lConf.tileGrid = lConf.tileGridRef ? me.tileGrids[lConf.tileGridRef] : undefined;

        // Automatically set the appropriate z-index for the layer type,
        // if not defined explicitly.
        lConf.zIndex = lConf.zIndex ?? (lConf.isBaseLayer ? -1 : 0);

        // Default usage of permalink to true, if not explicitly defined.
        lConf.supportsPermalink = lConf.supportsPermalink ?? true;

        let layer = LayerFactory.getInstance(lConf, me.map);
        layers.push(layer);

        // if layer is selectable register a select interaction
        if (lConf.selectable) {
          let selectClick = MapInteractionUtil.createSelectInteraction(
            layer,
            lConf.selectStyle,
            lConf.doAppendSelectStyle
          )
          // register/activate interaction on map
          me.map.addInteraction(selectClick);
        }
      });

      return layers;
    },

    /**
     * Hook up events to process newly added and modified OL layers.
     * This is currently used to update locale specific layer properties.
     */
    registerLayerEvents () {
      const layers = this.map.getLayers();
      layers.on('add', evt => {
        const layer = evt.element;
        this.updateLocalizedLayerProps(evt.element);
        layer.on('propertychange', evt => {
          if (evt.key === 'lid' || evt.key === 'langKey') {
            this.updateLocalizedLayerProps(evt.target)
          }
        })
      })
    },

    /**
     * Creates a HoverController, override in subclass for specializations.
     *
     * @return {HoverController} HoverController instance.
     */
    createHoverController () {
      return new HoverController(this.map);
    },

    /**
     * Creates a PermalinkController, override in subclass for specializations.
     *
     * @return {PermalinkController} PermalinkController instance.
     */
    createPermalinkController () {
      return new PermalinkController(this.map, this.$appConfig.permalink);
    },

    /**
     * Sets the background color of the OL buttons to the color property.
     */
    setOlButtonColor () {
      const colors = 'secondary onsecondary--text'

      // apply vuetify color by transforming the color to the corresponding
      // CSS class (see https://vuetifyjs.com/en/framework/colors)
      const classes = colors.toString().trim().split(' ');

      // zoom
      if (document.querySelector('.ol-zoom')) {
        classes.forEach(function (c) {
          document.querySelector('.ol-zoom .ol-zoom-in').classList.add(c);
          document.querySelector('.ol-zoom .ol-zoom-out').classList.add(c);
        });
      }

      // rotate
      if (document.querySelector('.ol-rotate')) {
        classes.forEach(function (c) {
          document.querySelector('.ol-rotate .ol-rotate-reset').classList.add(c);
        });
      }
    },

    /**
     * Initializes the geodata drag-drop functionality:
     * Adds the ol/interaction/DragAndDrop to the map and draws the dropped
     * features in a vector layer
     */
    setupGeodataDragDrop () {
      const mapDdConf = this.mapGeodataDragDop;
      const formats = mapDdConf.formats.filter(formatStr => {
        return this.formatMapping[formatStr];
      }).map(fs => {
        return this.formatMapping[fs];
      });

      const dragAndDropInteraction = new DragAndDrop({
        formatConstructors: formats
      });

      dragAndDropInteraction.on('addfeatures', event => {
        let ddSource;

        if (mapDdConf.replaceData !== false) {
          if (!this.dragDropLayerCreated) {
            this.createDragDropLayer(mapDdConf);
            this.dragDropLayerCreated = true;
          }

          // replace existing geodata with the newly dropped data set
          const ddLayer = LayerUtil.getLayersBy(
            'wegueDragDropLayer', true, this.map)[0];
          ddSource = ddLayer.getSource();
          ddSource.clear();
        } else {
          // add new layer for each dropped data set
          const newDdLayer = this.createDragDropLayer(mapDdConf);
          ddSource = newDdLayer.getSource();
        }

        ddSource.addFeatures(event.features);

        if (mapDdConf.zoomToData === true) {
          ViewAnimationUtil.to(this.map.getView(), ddSource.getExtent());
        }
      }, this);

      return dragAndDropInteraction;
    },

    /**
     * Creates the vector layer for showing drag/drop geodata on the map.
     *
     * @param {Object} mapDdConf the config object for this functionality
     */
    createDragDropLayer (mapDdConf) {
      const vectorSource = new VectorSource({});
      const vectorLayer = new VectorLayer({
        // random unique layer ID
        // For localization the randomized layer ID cannot be used, therefore map it to a fixed key
        // which will be part of the language path ('mapLayers.wgu-drag-drop-layer')
        lid: 'wgu-drag-drop-layer-' + (Math.random() * 1000000).toFixed(0),
        langKey: 'wgu-drag-drop-layer',
        wegueDragDropLayer: true,
        source: vectorSource,
        displayInLayerList: mapDdConf.displayInLayerList
      });
      this.map.addLayer(vectorLayer);

      return vectorLayer;
    },

    /**
     * Updates locale specific layer properties. This is typically invoked after changes to
     * layer attributes, changes to the OpenLayers layer collection to process new layers
     * or after changes to the active locale.
     *
     * Remarks:
     * If a layer definition exists in the application context, any 'name' or 'attribution'
     * property declared there will take precedence over the ones declared in the
     * language packs.
     *
     * @param {ol.layer.Layer} OL layer instance
     */
    updateLocalizedLayerProps (layer) {
      const langKey = layer.get('langKey') || layer.get('lid');
      const pathLayer = 'mapLayers.' + langKey;

      // Update layer name.
      const pathName = pathLayer + '.name';
      layer.set('name', layer.get('confName') || this.$t(pathName));

      // Update optional layer attributions.
      const pathAttributions = pathLayer + '.attributions';
      const source = layer.getSource();
      if (source &&
         (typeof source.setAttributions === 'function') &&
         (layer.get('confAttributions') || this.$te(pathAttributions))) {
        source.setAttributions(layer.get('confAttributions') || this.$t(pathAttributions));
      }
    }
  },
  watch: {
    /**
     * Watch for locale changes and update language specific layer attributes.
     */
    '$i18n.locale': function () {
      const layers = this.map.getLayers();
      layers.forEach(layer => {
        this.updateLocalizedLayerProps(layer);
      });
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  div.ol-zoom {
    top: auto;
    left: auto;
    bottom: 3em;
    right: 0.5em;
  }

  div.ol-attribution.ol-uncollapsible {
    font-size: 10px;
  }
</style>
