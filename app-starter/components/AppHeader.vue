<template>
  <v-app-bar
    class="wgu-app-toolbar onprimary--text"
    color="primary"
    fixed
    app
    clipped-left
    clipped-right
  >

    <!-- slot to inject components at the beginning (before title) -->
    <slot name="wgu-tb-start"></slot>

    <v-toolbar-title>{{ $t('app.title') }}</v-toolbar-title>

    <!-- slot to inject components after the title text -->
    <slot name="wgu-tb-after-title"></slot>

    <v-spacer></v-spacer>

    <!-- slot to inject components before the auto-generated buttons (by config) -->
    <slot name="wgu-tb-before-auto-buttons"></slot>

    <template v-for="(tbButton, index) in tbButtons">
      <component
        :is="tbButton.type" :key="index"
        v-bind="tbButton"
      />
    </template>

    <!-- slot to inject components after the auto-generated buttons (by config) -->
    <slot name="wgu-tb-after-auto-buttons"></slot>

    <v-menu v-if="menuButtons.length" offset-y nudge-bottom="15">
      <template v-slot:activator="{on}">

      <v-btn icon v-on="on"
        color="onprimary"
        :title="$t('wgu-toolbar-menu.title')">
        <v-icon medium>menu</v-icon>
      </v-btn>
      </template>
      <v-list color="primary">
          <template v-for="(tbButton, index) in menuButtons">
            <v-list-item :key="index">
              <component 
                  :is="tbButton.type" :key="index"
                  v-bind="tbButton"
               />
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
import ToggleButton from '../../src/components/modulecore/ToggleButton'
import ZoomToMaxExtentButton from '../../src/components/maxextentbutton/ZoomToMaxExtentButton'
import Geocoder from '../../src/components/geocoder/Geocoder'
import Geolocator from '../../src/components/geolocator/Geolocator'
import LocaleSwitcher from '../../src/components/localeswitcher/LocaleSwitcher'
import ThemeSwitcher from '../../src/components/themeswitcher/ThemeSwitcher'

export default {
  name: 'wgu-app-header',
  components: {
    'wgu-toggle-btn': ToggleButton,
    'wgu-geocoder-btn': Geocoder,
    'wgu-zoomtomaxextent-btn': ZoomToMaxExtentButton,
    'wgu-geolocator-btn': Geolocator,
    'wgu-localeswitcher-btn': LocaleSwitcher,
    'wgu-themeswitcher-btn': ThemeSwitcher
  },
  props: {},
  data () {
    return {
      menuButtons: this.getModuleButtons('menu'),
      tbButtons: this.getModuleButtons('toolbar')
    }
  },
  methods: {
    /**
     * Determines the module button configuration objects from app-config:
     * If the module button toggles a window, then a generic wgu-toggle-btn will
     * be returned - otherwise the button is custom.
     *
     *    menuButtons: [
     *      {type: 'wgu-layerlist-toggle-btn'},
     *      {type: 'wgu-helpwin-toggle-btn'},
     *      {type: 'wgu-measuretool-toggle-btn'}
     *    ]
     * @param  {String} target Either 'menu' or 'toolbar'
     * @return {Array} module button configuration objects
     */
    getModuleButtons (target) {
      const appConfig = Vue.prototype.$appConfig || {};
      const modulesConfs = appConfig.modules || {};
      let buttons = [];
      for (const key of Object.keys(modulesConfs)) {
        const moduleOpts = appConfig.modules[key];
        if (moduleOpts.target === target) {
          buttons.push({
            type: moduleOpts.win ? 'wgu-toggle-btn' : key + '-btn',
            moduleName: key,
            ...moduleOpts
          });
        }
      }
      return buttons;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
