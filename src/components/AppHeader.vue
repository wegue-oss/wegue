<template>
  <v-toolbar
    class="wgu-app-toolbar white--text"
    color="red darken-3"
    fixed
    app
    clipped-right
  >
    <v-toolbar-title>{{title}}</v-toolbar-title>
    <v-spacer></v-spacer>

    <!--This <slot> is going to be replaced by the toolbar buttons in the
      app configuration tags (see App.vue) -->
    <!-- <v-layout justify-end class="">
      <slot name="wgu-tb-buttons"></slot>
    </v-layout> -->

    <template v-for="(tbButton, index) in tbButtons">
      <component :is="tbButton.type" :key="index" :icon="tbButton.icon" :text="tbButton.text"/>
    </template>

    <v-menu offset-y>
      <v-btn icon dark slot="activator">
        <v-icon medium>menu</v-icon>
      </v-btn>
      <v-list>
          <template v-for="(tbButton, index) in menuButtons">
              <v-list-tile>
                <component :is="tbButton.type" :key="index" :icon="tbButton.icon" :text="tbButton.text" />
              </v-list-tile>
          </template>
      </v-list>
    </v-menu>

  </v-toolbar>
</template>

<script>

import Vue from 'vue'
import LayerListToggleButton from './layerlist/ToggleButton'
import HelpWinToggleButton from './helpwin/ToggleButton'
import MeasureToolToggleButton from './measuretool/ToggleButton'
import InfoClickButton from './infoclick/ToggleButton'
import ZoomToMaxExtentButton from './maxextentbutton/ZoomToMaxExtentButton'

export default {
  name: 'wgu-app-header',
  components: {
    'wgu-zoomtomaxextent-btn': ZoomToMaxExtentButton,
    'wgu-layerlist-btn': LayerListToggleButton,
    'wgu-helpwin-btn': HelpWinToggleButton,
    'wgu-measuretool-btn': MeasureToolToggleButton,
    'wgu-infoclick-btn': InfoClickButton
  },
  data () {
    return {
      title: this.$appConfig.title,
      menuButtons: this.getModuleButtonData(),
      tbButtons: this.getToolbarButtons()
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
      const appConfig = Vue.prototype.$appConfig;
      let moduleWins = [];
      for (const key of Object.keys(appConfig.modules)) {
        const moduleOpts = appConfig.modules[key];
        if (moduleOpts.target === 'menu') {
          moduleWins.push({type: key + '-btn', target: moduleOpts.target});
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
      const appConfig = Vue.prototype.$appConfig;
      let moduleWins = [];
      for (const key of Object.keys(appConfig.modules)) {
        const moduleOpts = appConfig.modules[key];
        if (moduleOpts.target === 'toolbar') {
          moduleWins.push({type: key + '-btn', target: moduleOpts.target});
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
