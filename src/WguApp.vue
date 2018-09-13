<template>
  <v-app id="wgu-app" :class="{ 'wgu-app': true, 'wgu-app-embedded': isEmbedded }">

    <wgu-app-header>

        <v-toolbar-items slot="wgu-tb-buttons">

            <wgu-zoomtomaxextent-button
              icon="zoom_out_map"
              text=""
            />

            <wgu-toggle-layerlist-button
              icon="layers"
              text=""
            />

            <wgu-toggle-measuretool-button
              icon="photo_size_select_small"
              text=""
            />

            <wgu-toggle-infoclick-button
              icon="info"
              text=""
            />

            <wgu-toggle-helpwin-button
              icon="help"
              text=""
            />

        </v-toolbar-items>

    </wgu-app-header>

    <v-content>
      <v-container id="ol-map-container" fluid fill-height style="padding: 0">
         <wgu-map />
      </v-container>
    </v-content>

    <v-footer color="red darken-3" class="white--text" app>
      <v-spacer></v-spacer>
      <span>meggsimum &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

  </v-app>
</template>

<script>
  import OlMap from './components/ol/Map'
  import AppHeader from './components/AppHeader'
  import LayerListToggleButton from './components/layerlist/ToggleButton'
  import HelpWinToggleButton from './components/helpwin/ToggleButton'
  import MeasureToolToggleButton from './components/measuretool/ToggleButton'
  import InfoClickButton from './components/infoclick/ToggleButton'
  import ZoomToMaxExtentButton from './components/maxextentbutton/ZoomToMaxExtentButton'

  export default {
    components: {
      'wgu-map': OlMap,
      'wgu-app-header': AppHeader,
      'wgu-toggle-layerlist-button': LayerListToggleButton,
      'wgu-toggle-helpwin-button': HelpWinToggleButton,
      'wgu-toggle-measuretool-button': MeasureToolToggleButton,
      'wgu-toggle-infoclick-button': InfoClickButton,
      'wgu-zoomtomaxextent-button': ZoomToMaxExtentButton
    },
    data: () => ({
      isEmbedded: false
    })
  }
</script>
