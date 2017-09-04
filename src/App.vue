<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <app-header />

    <v-webgis-top-logo logoSrc="http://via.placeholder.com/100x100"/>

    <ol-map :zoom="2" >

      <ol-layer-osm slot="single-layer" :opacity="1.0"/>

      <ol-layer-tilewms slot="single-layer"
        url="https://ahocevar.com/geoserver/wms"
        layers="topp:states"
        tiled
      />

    </ol-map>
    <info-window></info-window>
  </div>
</template>

<script>
import OlMap from './components/ol/OlMap'
import OsmLayer from './components/ol/OlLayerOsm'
import TileWmsLayer from './components/ol/OlLayerTileWms'
import InfoWindow from './components/InfoWindow'
import AppHeader from './components/AppHeader'
import TopLogo from './components/TopLogo'

export default {
  name: 'app',
  components: {
    OlMap,
    'ol-layer-osm': OsmLayer,
    'ol-layer-tilewms': TileWmsLayer,
    InfoWindow,
    AppHeader,
    'v-webgis-top-logo': TopLogo
  }
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /*-webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;*/
  /*margin-top: 60px;*/
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
