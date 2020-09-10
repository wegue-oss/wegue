<template>
  <v-app-bar
    class="wgu-app-toolbar white--text"
    :color="color"
    fixed
    app
    clipped-right
  >

    <!-- slot to inject components at the beginning (before title) -->
    <slot name="wgu-tb-start"></slot>

    <v-toolbar-title>{{title}}</v-toolbar-title>

    <!-- slot to inject components after the title text -->
    <slot name="wgu-tb-after-title"></slot>

    <v-spacer></v-spacer>

    <!-- slot to inject components before the auto-generated buttons (by config) -->
    <slot name="wgu-tb-before-auto-buttons"></slot>

    <template v-for="(tbButton, index) in tbButtons">
      <component
        :is="tbButton.type" :key="index"
        :icon="tbButton.icon" :text="tbButton.text"
        :color="color"
        :dark="tbButton.dark"
      />
    </template>

    <!-- slot to inject components after the auto-generated buttons (by config) -->
    <slot name="wgu-tb-after-auto-buttons"></slot>

    <v-menu v-if="menuButtons.length" offset-y>
      <!--v-slot="activator" to v-slot:activator="{on}" -->
      <template v-slot:activator="{on}">
      
      <v-btn icon dark v-on="on">
        <v-icon medium>menu</v-icon>
      </v-btn>
      </template>
      <v-list>
          <template v-for="(tbButton, index) in menuButtons">
              <v-list-item 
                 :is="tbButton.type" :key="index" :icon="tbButton.icon" :text="tbButton.text" :color="color" >
              </v-list-item>
          </template>
      </v-list>
    </v-menu>

    <!-- slot to inject components at the end of the toolbar (after menu) -->
    <slot name="wgu-tb-end"></slot>

  </v-app-bar>
</template>

<script>

import Vue from 'vue'
import LayerListToggleButton from '../../src/components/layerlist/ToggleButton'
import HelpWinToggleButton from '../../src/components/helpwin/ToggleButton'
import MeasureToolToggleButton from '../../src/components/measuretool/ToggleButton'
import InfoClickButton from '../../src/components/infoclick/ToggleButton'
import ZoomToMaxExtentButton from '../../src/components/maxextentbutton/ZoomToMaxExtentButton'
import Geocoder from '../../src/components/geocoder/Geocoder'
import Geolocator from '../../src/components/geolocator/Geolocator'

export default {
  name: 'wgu-app-header',
  components: {
    'wgu-geocoder-btn': Geocoder,
    'wgu-zoomtomaxextent-btn': ZoomToMaxExtentButton,
    'wgu-layerlist-btn': LayerListToggleButton,
    'wgu-helpwin-btn': HelpWinToggleButton,
    'wgu-measuretool-btn': MeasureToolToggleButton,
    'wgu-infoclick-btn': InfoClickButton,
    'wgu-geolocator-btn': Geolocator
  },
  props: {
    color: {type: String, required: false, default: 'red darken-3'}
  },
  data () {
    return {
      title: this.$appConfig.title,
      menuButtons: this.getModuleButtonData() || [],
      tbButtons: this.getToolbarButtons() || []
    }
  },
  methods: {
    /**
     * Determines the module menu button configuration objects from app-config:
     *    menuButtons: [
     *      {type: 'wgu-layerlist-toggle-btn'},
     *      {type: 'wgu-helpwin-toggle-btn'},
     *      {type: 'wgu-measuretool-toggle-btn'}
     *    ]
     * @return {Array} module button configuration objects for the menu
     */
    getModuleButtonData () {
      const appConfig = Vue.prototype.$appConfig || {};
      const modulesConfs = appConfig.modules || {};
      let moduleWins = [];
      for (const key of Object.keys(modulesConfs)) {
        const moduleOpts = appConfig.modules[key];
        if (moduleOpts.target === 'menu') {
          moduleWins.push({
            type: key + '-btn',
            target: moduleOpts.target
          });
        }
      }
      return moduleWins;
    },
    /**
     * Determines the module toolbar button configuration objects from app-config:
     *    menuButtons: [
     *      {type: 'wgu-layerlist-toggle-btn'},
     *      {type: 'wgu-helpwin-toggle-btn'},
     *      {type: 'wgu-measuretool-toggle-btn'}
     *    ]
     * @return {Array} module button configuration objects for the toolbar
     */
    getToolbarButtons () {
      const appConfig = Vue.prototype.$appConfig || {};
      const modulesConfs = appConfig.modules || {};
      let moduleWins = [];
      for (const key of Object.keys(modulesConfs)) {
        const moduleOpts = appConfig.modules[key];
        if (moduleOpts.target === 'toolbar') {
          moduleWins.push({
            type: key + '-btn',
            target: moduleOpts.target,
            dark: moduleOpts.darkLayout
          });
        }
      }
      return moduleWins;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
