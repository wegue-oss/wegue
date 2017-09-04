<template>
    <div class="map" id="map">

      <slot name="single-layer">LAYER SLOT DEFAULT / FALLBACK</slot>
      <!-- <ol-layer-osm /> -->

    </div>
</template>

<script>

import OsmLayer2 from './OlLayerOsm.vue'

import Map from 'ol/map'
import View from 'ol/view'
// import TileLayer from 'ol/layer/tile'
// import XYZ from 'ol/source/xyz'

export default {
  name: 'ol-map',
  data () {
    return {
    }
  },
  props: ['zoom'],
  components: {
    'ol-layer-osm': OsmLayer2
  },
  mounted () {
    this.map.setTarget(document.getElementById('map'))
  },
  created () {
    console.log('CRETAED MAP', this)
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
</style>
