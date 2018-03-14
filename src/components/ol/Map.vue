<template>
    <div class="map wgu-map" id="ol-map"></div>
</template>

<script>

import Map from 'ol/map'
import View from 'ol/view'
import Attribution from 'ol/control/attribution';
import Zoom from 'ol/control/zoom';
// import the app-wide EventBus
import { WguEventBus } from '../../WguEventBus.js'
import { LayerFactory } from '../../factory/Layer.js'

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
    this.map.setTarget(document.getElementById('ol-map'))

    // Send the event 'ol-map-mounted' with the OL map as payload
    WguEventBus.$emit('ol-map-mounted', this.map)

    // resize the map, so it fits to parent
    window.setTimeout(() => {
      this.map.updateSize();
    }, 100);
  },
  created () {
    const layers = this.createLayers();

    this.map = new Map({
      layers: layers,
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
  },

  methods: {
    /**
     * Creates the OL layers due to the "mapLayers" array in app config.
     * @return {ol.layer.Base[]} Array of OL layer instances
     */
    createLayers () {
      let layers = [];
      this.$appConfig.mapLayers.reverse().forEach(function (lConf) {
        let layer = LayerFactory.getInstance(lConf);
        layers.push(layer);
      });

      return layers;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .wgu-map .ol-zoom {
    top: auto;
    left: auto;
    bottom: 3em;
    right: 0.5em;
  }

  .wgu-map .ol-control button {
    background-color: #c62828;
  }
</style>
