<template>
  <div id="app" data-app>
      <!-- <img src="./assets/logo.png"> -->
      <app-header
        title="Vue.js / OpenLayers WebGIS">

        <v-toolbar-items slot="tb-buttons" class="hidden-sm-and-down">

            <v-webgis-menubutton
              icon="terrain"
              text="Foo"
            />

            <v-webgis-toggle-layerlist-button
              icon="layers"
              text=""
            />

            <v-webgis-toggle-helpwin-button
              icon="help"
              text=""
            />

        </v-toolbar-items>
      </app-header>

      <v-webgis-top-logo logoSrc="http://via.placeholder.com/100x100"/>

      <ol-map :zoom="2">

        <ol-layer-osm slot="map-layers" :opacity="1.0" name="OSM"/>

        <ol-layer-vectortiles slot="map-layers"
          name="Vector Tile Layer"
          url="https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf"
          format="MVT"
          hidden
        />

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
          styleRef="shopStyle"
        />

      </ol-map>

      <feature-info-window
        layerId="Shops"
      />

      <layer-list />

      <v-webgis-helpwin />

  </div>
</template>

<script>
import OlMap from './components/ol/OlMap'
import OsmLayer from './components/ol/OlLayerOsm'
import TileWmsLayer from './components/ol/OlLayerTileWms'
import VectorLayer from './components/ol/OlLayerVector'
import VectorTileLayer from './components/ol/OlLayerVectorTiles'
import InfoWindow from './components/InfoWindow'
import FeatureInfoWindow from './components/FeatureInfoWindow'
import AppHeader from './components/AppHeader'
import TopLogo from './components/TopLogo'
import MenuButton from './components/MenuButton'
import LayerListToggleButton from './components/layerlist/ToggleButton'
import LayerList from './components/layerlist/LayerList'
import HelpWinToggleButton from './components/helpwin/ToggleButton'
import HelpWin from './components/helpwin/HelpWin'

export default {
  name: 'app',
  components: {
    OlMap,
    'ol-layer-osm': OsmLayer,
    'ol-layer-tilewms': TileWmsLayer,
    'ol-layer-vector': VectorLayer,
    'ol-layer-vectortiles': VectorTileLayer,
    InfoWindow,
    FeatureInfoWindow,
    AppHeader,
    'v-webgis-top-logo': TopLogo,
    'v-webgis-menubutton': MenuButton,
    // 'v-webgis-toggle-ui-button': ToggleUiButton,
    'v-webgis-toggle-layerlist-button': LayerListToggleButton,
    LayerList,
    'v-webgis-toggle-helpwin-button': HelpWinToggleButton,
    'v-webgis-helpwin': HelpWin
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
