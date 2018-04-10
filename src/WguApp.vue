<template>
  <div id="app" data-app :class="{ 'wgu-app': true, 'wgu-app-embedded': isEmbedded }">

      <wgu-app-header>

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

      <wgu-top-logo />

      <wgu-map />

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
