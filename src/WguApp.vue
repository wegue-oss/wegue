<template>
  <div id="app" data-app :class="{ 'wgu-app': true, 'wgu-app-embedded': isEmbedded }">

      <wgu-app-header
        title="Vue.js / OpenLayers WebGIS">

        <v-toolbar-items slot="wgu-tb-buttons" class="">

            <wgu-toggle-layerlist-button
              icon="layers"
              text=""
            />

            <wgu-toggle-measuretool-button
              icon="photo_size_select_small"
              text=""
            />

            <wgu-toggle-helpwin-button
              icon="help"
              text=""
            />

        </v-toolbar-items>
      </wgu-app-header>

      <wgu-top-logo logoSrc="http://via.placeholder.com/100x100?text=A%20Logo"/>

      <wgu-map :zoom="2">

        <wgu-layer-osm slot="map-layers" :opacity="1.0" name="OSM"/>

        <wgu-layer-vectortiles slot="map-layers"
          name="Vector Tile Layer"
          url="https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf"
          format="MVT"
          hidden
        />

        <wgu-layer-tilewms slot="map-layers"
          name="WMS (ahocevar)"
          url="https://ahocevar.com/geoserver/wms"
          layers="topp:states"
          tiled
        />

        <wgu-layer-vector slot="map-layers"
          name="Shops"
          url="./static/data/shops-dannstadt.geojson"
          format="GeoJSON"
          :formatConfig="{}"
          selectable
          styleRef="shopStyle"
        />

      </wgu-map>

      <wgu-feature-infowindow
        layerId="Shops"
        imageProp="image"
        titleProp="name"
        icon="info"
        title="Information"
      />

  </div>
</template>

<script>

import OlMap from './components/ol/Map'
import OsmLayer from './components/ol/LayerOsm'
import TileWmsLayer from './components/ol/LayerTileWms'
import VectorLayer from './components/ol/LayerVector'
import VectorTileLayer from './components/ol/LayerVectorTiles'
import InfoWindow from './components/InfoWindow'
import FeatureInfoWindow from './components/FeatureInfoWindow'
import AppHeader from './components/AppHeader'
import TopLogo from './components/TopLogo'
import MenuButton from './components/MenuButton'
import LayerListToggleButton from './components/layerlist/ToggleButton'
import HelpWinToggleButton from './components/helpwin/ToggleButton'
import MeasureToolToggleButton from './components/measuretool/ToggleButton'

export default {
  name: 'app',
  components: {
    'wgu-map': OlMap,
    'wgu-layer-osm': OsmLayer,
    'wgu-layer-tilewms': TileWmsLayer,
    'wgu-layer-vector': VectorLayer,
    'wgu-layer-vectortiles': VectorTileLayer,
    'wgu-info-window': InfoWindow,
    'wgu-feature-infowindow': FeatureInfoWindow,
    'wgu-app-header': AppHeader,
    'wgu-top-logo': TopLogo,
    'wgu-menubutton': MenuButton,
    'wgu-toggle-layerlist-button': LayerListToggleButton,
    'wgu-toggle-helpwin-button': HelpWinToggleButton,
    'wgu-toggle-measuretool-button': MeasureToolToggleButton
  },
  data () {
    return {
      isEmbedded: false
    }
  },
  mounted () {
    // apply the isEmbedded state to the member var
    this.isEmbedded = this.$isEmbedded;
  }
}
</script>

<style>

</style>
