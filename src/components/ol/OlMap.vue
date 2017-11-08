<template>
    <div class="map" id="map">
      <!--This <slot> is going to be replaced by the map-layer configuration
          tags in the app (see App.vue) -->
      <slot name="map-layers">No map layers provided!</slot>
    </div>
</template>

<script>

import Map from 'ol/map'
import View from 'ol/view'
// the app-wide EventBus
import { EventBus } from '../../EventBus.js'

export default {
  name: 'ol-map',
  props: {
    zoom: {type: Number, default: 0},
    center: {type: Array}
  },
  mounted () {
    this.map.setTarget(document.getElementById('map'))

    // Send the event 'ol-map-mounted' with the OL map as payload
    EventBus.$emit('ol-map-mounted', this.map)
  },
  created () {
    this.map = new Map({
      target: 'map',
      layers: [
      ],
      view: new View({
        center: this.center || [0, 0],
        zoom: this.zoom
      })
    })
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .map {
    flex-grow: 1
  }

  .ol-zoom {
    top: auto;
    left:auto;
    bottom: 3em;
    right: 0.5em;
  }
</style>
