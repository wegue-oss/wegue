<template></template>

<script>

import Vue from 'vue';
import Map from 'ol/Map'
import View from 'ol/View'
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom';
import SelectInteraction from 'ol/interaction/Select';
import {defaults as defaultInteractions} from 'ol/interaction';
import RotateControl from 'ol/control/Rotate';
import Projection from 'ol/proj/Projection';
import {register as olproj4} from 'ol/proj/proj4';
import proj4 from 'proj4'
import Overlay from 'ol/Overlay';
// import the app-wide EventBus
import { WguEventBus } from '../../WguEventBus.js';
import { LayerFactory } from '../../factory/Layer.js';
import ColorUtil from '../../util/Color';
import PermalinkController from './PermalinkController';

export default {
  name: 'wgu-map',
  props: {
    color: {type: String, required: false, default: 'red darken-3'},
    collapsibleAttribution: {type: Boolean, default: false},
    rotateableMap: {type: Boolean, required: false, default: false}
  },
  data () {
    return {
      zoom: this.$appConfig.mapZoom,
      center: this.$appConfig.mapCenter,
      projection: this.$appConfig.mapProjection,
      projectionObj: null,
      projectionDefs: this.$appConfig.projectionDefs,
      permalink: this.$appConfig.permalink
    }
  },
  mounted () {
    var me = this;
    // Make the OL map accessible for Mapable mixin even 'ol-map-mounted' has
    // already been fired. Don not use directly in cmps, use Mapable instead.
    Vue.prototype.$map = me.map;
    // Send the event 'ol-map-mounted' with the OL map as payload
    WguEventBus.$emit('ol-map-mounted', me.map);

    // resize the map, so it fits to parent
    window.setTimeout(() => {
      me.map.setTarget(document.getElementById('ol-map-container'));
      me.map.updateSize();

      // adjust the bg color of the OL buttons (like zoom, rotate north, ...)
      me.setOlButtonColor();

      // initialize map hover functionality
      me.setupMapHover();
    }, 200);
  },
  created () {
    // make map rotateable according to property
    const interactions = defaultInteractions({
      altShiftDragRotate: this.rotateableMap,
      pinchRotate: this.rotateableMap
    });
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

    // Projection for Map, default is Web Mercator
    if (!this.projection) {
      this.projection = {code: 'EPSG:3857', units: 'm'}
    }

    this.map = new Map({
      layers: [],
      controls: controls,
      interactions: interactions,
      view: new View({
        center: this.center,
        zoom: this.zoom,
        projection: new Projection(this.projection)
      })
    });

    if (this.$appConfig.permalink) {
      this.permalinkController = this.createPermalinkController();
      this.permalinkController.apply();
      this.permalinkController.setup();
    }

    // create layers from config and add them to map
    const layers = this.createLayers();
    this.map.getLayers().extend(layers);
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
        let layer = LayerFactory.getInstance(lConf);
        layers.push(layer);

        // if layer is selectable register a select interaction
        if (lConf.selectable) {
          const selectClick = new SelectInteraction({
            layers: [layer]
          });
          // forward an event if feature selection changes
          selectClick.on('select', function (evt) {
            // TODO use identifier for layer (once its implemented)
            WguEventBus.$emit(
              'map-selectionchange',
              layer.get('lid'),
              evt.selected,
              evt.deselected
            );
          });
          // register/activate interaction on map
          me.map.addInteraction(selectClick);
        }
      });

      return layers;
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
      var me = this;

      if (ColorUtil.isCssColor(me.color)) {
        // directly apply the given CSS color
        if (document.querySelector('.ol-zoom')) {
          document.querySelector('.ol-zoom .ol-zoom-in').style.backgroundColor = me.color;
          document.querySelector('.ol-zoom .ol-zoom-out').style.backgroundColor = me.color;
        }
        if (document.querySelector('.ol-rotate')) {
          document.querySelector('.ol-rotate .ol-rotate-reset').style.backgroundColor = me.color;
        }
      } else {
        // apply vuetify color by transforming the color to the corresponding
        // CSS class (see https://vuetifyjs.com/en/framework/colors)
        const [colorName, colorModifier] = me.color.toString().trim().split(' ', 2);
        if (document.querySelector('.ol-zoom')) {
          document.querySelector('.ol-zoom .ol-zoom-in').classList.add(colorName);
          document.querySelector('.ol-zoom .ol-zoom-in').classList.add(colorModifier);
          document.querySelector('.ol-zoom .ol-zoom-out').classList.add(colorName);
          document.querySelector('.ol-zoom .ol-zoom-out').classList.add(colorModifier);
        }
        if (document.querySelector('.ol-rotate')) {
          document.querySelector('.ol-rotate .ol-rotate-reset').classList.add(colorName);
          document.querySelector('.ol-rotate .ol-rotate-reset').classList.add(colorModifier);
        }
      }
    },
    /**
     * Initializes the map hover functionality:
     * Adds a little tooltip like DOM element, wrapped as OL Overlay to the
     * map.
     * Registers a 'pointermove' event on the map and shows the layer's
     * 'hoverAttribute' if the layer is configured as 'hoverable'
     */
    setupMapHover () {
      const me = this;
      const map = me.map;
      let overlayEl;

      // create a span to show map tooltip
      overlayEl = document.createElement('span');
      overlayEl.classList.add('wgu-hover-tooltiptext');
      map.getTarget().append(overlayEl);

      me.overlayEl = overlayEl;

      // wrap the tooltip span in a OL overlay and add it to map
      me.overlay = new Overlay({
        element: overlayEl,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });
      map.addOverlay(me.overlay);

      // show tooltip if a hoverable feature gets hit with the mouse
      map.on('pointermove', me.onPointerMove, me);
    },
    /**
     * Shows the hover tooltip on the map if an appropriate feature of a
     * 'hoverable' layer was hit with the mouse.
     *
     * @param  {Object} event The OL event for pointermove
     */
    onPointerMove (event) {
      const me = this;
      const map = me.map;
      const overlayEl = me.overlayEl;
      let hoverAttr;
      const features = map.getFeaturesAtPixel(event.pixel, {layerFilter: (layer) => {
        if (layer.get('hoverable')) {
          hoverAttr = layer.get('hoverAttribute');
        }
        return layer.get('hoverable');
      }});
      if (!features || features.length === 0 || !hoverAttr) {
        hoverAttr = null;
        overlayEl.innerHTML = null;
        me.overlay.setPosition(undefined);
        return;
      }
      const feature = features[0];
      var attr = feature.get(hoverAttr);
      overlayEl.innerHTML = attr;
      me.overlay.setPosition(event.coordinate);
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
    bottom: 12px;
    font-size: 10px;
  }

  /* Hover tooltip */
  .wgu-hover-tooltiptext {
    width: 120px;
    background-color: rgba(211, 211, 211, .9);
    color: #222;
    text-align: center;
    padding: 5px;
    border-radius: 6px;

    /* Position the hover tooltip */
    position: absolute;
    z-index: 1;
  }

</style>
