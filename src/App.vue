<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <app-header />
    <ol-map zoom=4>

      <ol-layer-osm slot="single-layer"> </ol-layer-osm>

    </ol-map>
    <info-window></info-window>
  </div>
</template>

<script>
import OlMap from './components/ol/OlMap'
import OsmLayer from './components/ol/OlLayerOsm'
import InfoWindow from './components/InfoWindow'
import AppHeader from './components/AppHeader'

export default {
  name: 'app',
  components: {
    OlMap,
    'ol-layer-osm': OsmLayer,
    InfoWindow,
    AppHeader
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
