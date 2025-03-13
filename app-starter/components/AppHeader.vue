<template>
  <v-app-bar
    class="wgu-app-toolbar"
    color="primary"
  >

    <!-- slot to inject components at the beginning (before title) -->
    <slot name="wgu-tb-start"></slot>

    <v-toolbar-title>{{ $t('app.title') }}</v-toolbar-title>

    <!-- slot to inject components after the title text -->
    <slot name="wgu-tb-after-title"></slot>

    <v-spacer></v-spacer>

    <!-- slot to inject components before the auto-generated buttons (by config) -->
    <slot name="wgu-tb-before-auto-buttons"></slot>

    <template v-for="(tbButton, index) in tbButtons" :key="index">
      <component
        v-bind="tbButton"
        :is="tbButton.type"
      />
    </template>

    <!-- slot to inject components after the auto-generated buttons (by config) -->
    <slot name="wgu-tb-after-auto-buttons"></slot>

    <v-menu v-if="menuButtons.length" eager offset="15">
      <template v-slot:activator="{props}">

      <v-btn v-bind="props"
        class="wgu-menu-button"
        :title="$t('wgu-toolbar-menu.title')"
        icon="md:menu">
      </v-btn>
      </template>
      <v-list bg-color="primary">
          <template v-for="(tbButton, index) in menuButtons" :key="index">
            <v-list-item class="py-0">
              <component
                  v-bind="tbButton"
                  :is="tbButton.type" :key="index"
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
import ToggleButton from '@/components/modulecore/ToggleButton';
import ZoomToMaxExtentButton from '@/components/maxextentbutton/ZoomToMaxExtentButton';
import Geocoder from '@/components/geocoder/Geocoder';
import Geolocator from '@/components/geolocator/Geolocator';
import LocaleSwitcher from '@/components/localeswitcher/LocaleSwitcher';
import ThemeSwitcher from '@/components/themeswitcher/ThemeSwitcher';

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
      const appConfig = this.$appConfig || {};
      const modulesConfs = appConfig.modules || {};
      const buttons = [];
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
