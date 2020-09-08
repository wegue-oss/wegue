<template>
  <v-toolbar
    class="wgu-app-toolbar white--text"
    :color="color"
    fixed
    app
    clipped-right
  >

    <!-- slot to inject components at the beginning (before title) -->
    <slot name="wgu-tb-start"></slot>
    <!-- Locate me - User Locator -->
    <v-tooltip bottom class="pl-2">
      <wgu-user-locator slot="activator"></wgu-user-locator>
      <span>Locate me</span>
    </v-tooltip>

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
      <v-btn icon dark slot="activator">
        <v-icon medium>menu</v-icon>
      </v-btn>
      <v-list>
          <template v-for="(tbButton, index) in menuButtons">
              <v-list-tile>
                <component :is="tbButton.type" :key="index" :icon="tbButton.icon" :text="tbButton.text" :color="color" />
              </v-list-tile>
          </template>
      </v-list>
    </v-menu>

    <v-badge overlap color="blue">
          <template v-slot:badge v-if="filteredFeatures.length > 0">
            <span>{{filteredFeatures.length}}</span>
          </template>
          <v-menu 
            :close-on-content-click="false" 
            :close-on-click="true"
            :nudge-left="250"  offset-x offset-y>
              <v-btn icon dark slot="activator">
              <v-icon medium>filter_alt</v-icon>
              </v-btn>
              <wgu-search-items v-on:filterUpdated="updateBadgeNumber"> </wgu-search-items>
          </v-menu>
    </v-badge>

    <!-- slot to inject components at the end of the toolbar (after menu) -->
    <slot name="wgu-tb-end"></slot>

  </v-toolbar>
</template>

<script>
import Vue from 'vue'
import LayerListToggleButton from '../../src/components/layerlist/ToggleButton'
import HelpWinToggleButton from '../../src/components/helpwin/ToggleButton'
import MeasureToolToggleButton from '../../src/components/measuretool/ToggleButton'
import InfoClickButton from '../../src/components/infoclick/ToggleButton'
import ZoomToMaxExtentButton from '../../src/components/maxextentbutton/ZoomToMaxExtentButton'
import Geocoder from '../../src/components/geocoder/Geocoder'
import UserLocator from '../../src/components/geolocator/UserLocator'
import SearchItems from '../../src/components/searchitems/SearchItems'

import { WguEventBus } from '../../src/WguEventBus'

export default {
  name: 'wgu-app-header',
  components: {
    'wgu-geocoder-btn': Geocoder,
    'wgu-zoomtomaxextent-btn': ZoomToMaxExtentButton,
    'wgu-layerlist-btn': LayerListToggleButton,
    'wgu-helpwin-btn': HelpWinToggleButton,
    'wgu-measuretool-btn': MeasureToolToggleButton,
    'wgu-infoclick-btn': InfoClickButton,
    'wgu-search-items': SearchItems,
    'wgu-user-locator': UserLocator
  },
  props: {
    color: {type: String, required: false, default: 'red darken-3'}
  },
  data () {
    return {
      title: this.$appConfig.title,
      menuButtons: this.getModuleButtonData() || [],
      tbButtons: this.getToolbarButtons() || [],
      filteredFeatures: []
    }
  },
  created () {
    var me = this;
    WguEventBus.$on('ol-map-mounted', olMap => {
      me.map = olMap;
    });
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
    },
    zoomToDataExtend () {
      let me = this;
      let itemLayer = me.map.getLayers().getArray().filter(layer => layer.get('lid') === 'Verkaufsstellen')[0];

      let actualExtent = itemLayer.getSource().getExtent();
      me.map.getView().fit(actualExtent, {
        duration: 1600,
        padding: [50, 50, 50, 50]
      });
    },
    updateBadgeNumber (selectedObjects) {
      let me = this;
      me.filteredFeatures = selectedObjects;
      me.$emit('filterUpdatedToMain', selectedObjects);
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
