<template>
  <div id="app">
      <!-- <img src="./assets/logo.png"> -->
      <app-header
        title="Vue.js / OpenLayers WebGIS">

        <v-toolbar-items slot="tb-buttons" class="hidden-sm-and-down">
            <v-webgis-menubutton
              icon="terrain"
              text="Foo"
            />

        </v-toolbar-items>
      </app-header>

      <v-webgis-top-logo logoSrc="http://via.placeholder.com/100x100"/>

      <ol-map :zoom="2">

        <ol-layer-osm slot="map-layers" :opacity="1.0" name="OSM"/>

        <ol-layer-tilewms slot="map-layers"
          name="WMS (ahocevar)"
          url="https://ahocevar.com/geoserver/wms"
          layers="topp:states"
          tiled
        />

        <ol-layer-vector slot="map-layers"
          name="Shops"
          url="./static/data/shops-dannstadt.geojson"
          format="GeoJSON"
          :formatConfig="{}"
          selectable
        />

      </ol-map>
      <!-- <info-window></info-window> -->
      <feature-info-window
        layerId="Shops"
      />

      <layer-list />

  </div>
</template>

<script>
import OlMap from './components/ol/OlMap'
import OsmLayer from './components/ol/OlLayerOsm'
import TileWmsLayer from './components/ol/OlLayerTileWms'
import VectorLayer from './components/ol/OlLayerVector'
import InfoWindow from './components/InfoWindow'
import FeatureInfoWindow from './components/FeatureInfoWindow'
import AppHeader from './components/AppHeader'
import TopLogo from './components/TopLogo'
import MenuButton from './components/MenuButton'
import LayerList from './components/LayerList'

export default {
  name: 'app',
  components: {
    OlMap,
    'ol-layer-osm': OsmLayer,
    'ol-layer-tilewms': TileWmsLayer,
    'ol-layer-vector': VectorLayer,
    InfoWindow,
    FeatureInfoWindow,
    AppHeader,
    'v-webgis-top-logo': TopLogo,
    'v-webgis-menubutton': MenuButton,
    LayerList
  }
}
</script>

<style>

html {
  /* otherwise we have always vertical scrollbars */
  overflow-y: auto;
}

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
