<template></template>

<script>

import Map from 'ol/Map'
import View from 'ol/View'
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom';
import SelectInteraction from 'ol/interaction/Select';
// import the app-wide EventBus
import { WguEventBus } from '../../WguEventBus.js';
import { LayerFactory } from '../../factory/Layer.js';

export default {
  name: 'wgu-map',
  props: {
    collapsibleAttribution: {type: Boolean, default: false}
  },
  data () {
    return {
      zoom: this.$appConfig.mapZoom,
      center: this.$appConfig.mapCenter
    }
  },
  mounted () {
    // Send the event 'ol-map-mounted' with the OL map as payload
    WguEventBus.$emit('ol-map-mounted', this.map)

    // resize the map, so it fits to parent
    window.setTimeout(() => {
      this.map.setTarget(document.getElementById('ol-map-container'));
      this.map.updateSize();
    }, 200);
  },
  created () {
    this.map = new Map({
      layers: [],
      controls: [
        new Zoom(),
        new Attribution({
          collapsible: this.collapsibleAttribution
        })
      ],
      view: new View({
        center: this.center || [0, 0],
        zoom: this.zoom
      })
    });

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
      this.$appConfig.mapLayers.reverse().forEach(function (lConf) {
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

  div.ol-control button {
    background-color: #c62828;
  }
  div.ol-control button:hover, .ol-control button:active, .ol-control button:focus {
    background-color: #d82828;
  }

  div.ol-attribution.ol-uncollapsible {
    bottom: 12px;
  }
</style>
