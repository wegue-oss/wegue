<template>
  <wgu-module-card v-bind="$attrs"
    :moduleName="moduleName"
    class="wgu-attributetable-win"
    :icon="icon"
  >

    <template v-slot:wgu-win-toolbar>
      <v-select
        v-model="selLayerLid"
        :color="isPrimaryDarkWithLightTheme ? 'white' : 'accent'"
        item-color="secondary"
        :theme="isDarkTheme ? 'dark' : 'light'"
        variant="outlined"
        class="wgu-vector-layer-select wgu-solo-field"
        :items="displayedItems"
        :menu-props="{
          bottom: true,
          'offset-y': true
        }"
        density="compact"
        hide-details
        :label="$t('wgu-attributetable.selectorLabel')"
        ></v-select>
    </template>

    <wgu-attributetable
      v-if="selLayerLid"
      :layerId="selLayerLid"
      :syncTableMapSelection="syncTableMapSelection"
    >
    </wgu-attributetable>
  </wgu-module-card>
</template>

<script>
import ModuleCard from '../modulecore/ModuleCard.vue';
import { useMap } from '@/composables/Map';
import { useColorTheme } from '@/composables/ColorTheme';
import VectorLayer from 'ol/layer/Vector';
import AttributeTable from './AttributeTable.vue';

export default {
  name: 'wgu-attributetable-win',
  inheritAttrs: false,

  props: {
    icon: { type: String, required: false, default: 'md:table_chart' },
    syncTableMapSelection: { type: Boolean, required: false, default: false }
  },
  setup () {
    const { layers } = useMap();
    const { isDarkTheme, isPrimaryDark, isPrimaryDarkWithLightTheme } = useColorTheme();

    return { layers, isDarkTheme, isPrimaryDark, isPrimaryDarkWithLightTheme };
  },
  data () {
    return {
      moduleName: 'wgu-attributetable',
      selLayerLid: null
    }
  },
  components: {
    'wgu-module-card': ModuleCard,
    'wgu-attributetable': AttributeTable
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
    /**
     * Reactive property to return the items object to bind to the selection menu.
     */
    displayedItems () {
      return this.displayedLayers.map((layer) => { return { title: layer.get('name'), value: layer.get('lid') } });
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
    bottom: 40px;
  }

  @media only screen and (max-width: 600px) {
    .wgu-attributetable-win.wgu-floating {
      bottom: 33px;
      height: 100%;
    }
  }
</style>
