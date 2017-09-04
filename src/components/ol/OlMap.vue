<template>
    <div class="map" id="map">

      <slot name="single-layer">LAYER SLOT DEFAULT / FALLBACK</slot>

    </div>
</template>

<script>

import Map from 'ol/map'
import View from 'ol/view'

export default {
  name: 'ol-map',
  data () {
    return {
    }
  },
  props: ['zoom'],
  mounted () {
    this.map.setTarget(document.getElementById('map'))
  },
  created () {
    this.map = new Map({
      target: 'map',
      layers: [
      ],
      view: new View({
        center: [0, 0],
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
