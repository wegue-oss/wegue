<template>
  <wgu-module-card v-bind="$attrs"
    :moduleName="moduleName"
    class="wgu-attributetable-win" 
    :icon="icon" 
    v-on:visibility-change="show">

    <template v-slot:wgu-win-toolbar>
      <v-select
        v-model="selLayer"
        color="accent"
        :dark="forceDark"
        item-color="secondary"
        :style='{
            background: isDark
              ? "hsla(0, 0%, 0%, 0.16)"
              : "hsla(0, 0%, 100%, 0.04)"
        }'
        outlined
        class="wgu-vector-layer-select"
        :items="displayedLayers"
		    :item-text="item => item.get('name')"
        :menu-props="{
          bottom: true,
          'offset-y': true,
        }"
        dense
        return-object
        hide-details
        :label="$t('wgu-attributetable.selectorLabel')"
        ></v-select>
    </template>
  
    <wgu-attributetable
      v-if="selLayer"
      v-resize="onResize"
      :layerId="selLayer.get('lid')"
      :syncTableMapSelection="syncTableMapSelection"
    >
    </wgu-attributetable>
  </wgu-module-card>
</template>

<script>
import ModuleCard from './../modulecore/ModuleCard';
import { Mapable } from '../../mixins/Mapable';
import VectorLayer from 'ol/layer/Vector'
import AttributeTable from './AttributeTable';
import Color from '../../util/Color'

export default {
  name: 'wgu-attributetable-win',
  inheritAttrs: false,

  props: {
    dark: { type: Boolean, required: false, default: true },
    icon: { type: String, required: false, default: 'table_chart' },
    syncTableMapSelection: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      moduleName: 'wgu-attributetable',
      layers: [],
      selLayer: null
    }
  },
  mixins: [Mapable],
  components: {
    'wgu-module-card': ModuleCard,
    'wgu-attributetable': AttributeTable
  },
  methods: {
    show () {
      // resize map properly after closing
      // the AttributeTable
      this.resizeOlMap()
    },
    onResize () {
      // change map size when window is changing
      this.resizeOlMap()
    },

    /**
     * Update the OpenLayers map size.
     *
     * Necessary because the map does not automatically
     * notice when its size is changed externally.
     */
    resizeOlMap () {
      this.$nextTick(() => {
        // must be within '$nextTick' to take effect
        this.map.updateSize();
      })
    },

    /**
     * This function is executed, after the map is bound (see mixins/Mapable).
     * Bind to the layers from the OpenLayers map.
     */
    onMapBound () {
      this.layers = this.map.getLayers().getArray();
    }
  },
  computed: {
    /**
     * Reactive property to return the OpenLayers vector layers to be shown in the selection menu.
     */
    displayedLayers () {
      return this.layers
        .filter(layer =>
          layer instanceof VectorLayer &&
          layer.get('lid') !== 'wgu-measure-layer' &&
          layer.get('lid') !== 'wgu-geolocator-layer'
        )
        .reverse();
    },

    // Checks if the vuetify dark theme is active
    isDark: function () {
      return this.$vuetify.theme.dark;
    },

    // Checks the luminance level of the primary color.
    // This is used to set the v-combobox to dark mode if
    // luminance is low.
    // Remove this if the "color" property of v-combobox
    // starts controlling the text/icon color when the
    // field isn't focused.
    forceDark: function () {
      const theme = this.$vuetify.theme.currentTheme;

      let primary = theme.primary;

      if (typeof primary === 'object') {
        primary = primary.base;
      }

      return Color.checkLuminance(primary);
    }
  }
};
</script>

<style scoped>

  /* TODO 
    Generalize the positioning concept for windows,
    this interferes with positioning and draggable settings in the app.conf */

  .wgu-attributetable-win.wgu-floating {
    top: inherit !important;
    position: relative;
    bottom: 35px;
  }

  @media only screen and (max-width: 600px) {
    .wgu-attributetable-win.wgu-floating {
      bottom: 33px;
      height: 100%;
    }
  }
</style>
