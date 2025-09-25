<template>
  <v-sheet :width="width" :height="height"
    elevation="8" class="pa-1" ref="overviewmapPanel">
  </v-sheet>
</template>

<script>
import { useMap } from '@/composables/Map';
import OverviewMapController from './OverviewMapController';

export default {
  name: 'wgu-overviewmap-panel',
  props: {
    rotateWithView: { type: Boolean, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  setup () {
    const { map, layers } = useMap();
    return { map, layers };
  },
  mounted () {
    this.createOverviewMapCtrl();
  },
  unmounted () {
    this.destroyOverviewMapCtrl();
  },
  methods: {
    /**
     * This function is executed, after the map is bound.
     */
    onMapBound () {
      this.createOverviewMapCtrl();
    },
    /**
     * This function is executed, before the map is unbound.
     */
    onMapUnbound () {
      this.destroyOverviewMapCtrl();
    },
    /**
     * Creates the OpenLayers overview map control.
     */
    createOverviewMapCtrl () {
      const panel = this.$refs.overviewmapPanel;
      if (this.map && panel && !this.overviewMap) {
        this.overviewMap = new OverviewMapController(this.map, panel.$el, this.$props);
        this.overviewMap.setLayer(this.selectedBgLayer.toRaw());
      }
    },
    /**
     * Tears down the OpenLayers overview map control.
     */
    destroyOverviewMapCtrl () {
      if (this.overviewMap) {
        this.overviewMap.destroy();
        this.overviewMap = undefined;
      }
    }
  },
  computed: {
    /**
     * Reactive property to return the currently visible OpenLayers background layer.
     * To disambiguate multiple selected background layers - which may occur programmatically -
     * this returns the first in the list of background layers.
     */
    selectedBgLayer () {
      if (!this.layers) {
        return {};
      }
      return this.layers.getArray()
        .filter(layer => layer.get('isBaseLayer'))
        .reverse()
        .find(layer => layer.getVisible());
    }
  },
  watch: {
    map: {
      handler (newMap, oldMap) {
        if (newMap) {
          this.onMapBound();
        } else {
          if (oldMap) {
            this.onMapUnbound();
          }
        }
      },
      immediate: true
    },
    /**
     * Watch for background layer selection change.
     */
    selectedBgLayer (newLayer) {
      if (this.overviewMap) {
        this.overviewMap.setLayer(newLayer.toRaw());
      }
    }
  }
};
</script>
