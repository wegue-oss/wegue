<template>
    <div class="map wgu-map" id="map">
      <!--This <slot> is going to be replaced by the map-layer configuration
          tags in the app (see App.vue) -->
      <slot name="map-layers">No map layers provided!</slot>
    </div>
</template>

<script>

import Map from 'ol/map'
import View from 'ol/view'
import Attribution from 'ol/control/attribution';
import Zoom from 'ol/control/zoom';
// import the app-wide EventBus
import { WguEventBus } from '../../WguEventBus.js'

export default {
  name: 'wgu-map',
  props: {
    zoom: {type: Number, default: 0},
    center: {type: Array},
    collapsibleAttribution: {type: Boolean, default: false}
  },
  mounted () {
    this.map.setTarget(document.getElementById('map'))

    // Send the event 'ol-map-mounted' with the OL map as payload
    WguEventBus.$emit('ol-map-mounted', this.map)
  },
  created () {
    this.map = new Map({
      target: 'map',
      layers: [
      ],
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
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .wgu-map.map {
    flex-grow: 1
  }

  .wgu-map .ol-zoom {
    top: auto;
    left:auto;
    bottom: 3em;
    right: 0.5em;
  }
</style>
