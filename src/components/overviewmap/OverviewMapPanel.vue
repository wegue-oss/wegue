<template>
  <v-sheet :width="width" :height="height"
    elevation="8" class="pa-1" ref="overviewmapPanel">
  </v-sheet>
</template>

<script>
  import { Mapable } from '../../mixins/Mapable';
  import OverviewMapController from './OverviewMapController';
  export default {
    name: 'wgu-overviewmap-panel',
    mixins: [Mapable],
    props: {
      rotateWithView: { type: Boolean, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    },
    data () {
      return {
        layers: []
      }
    },
    mounted () {
      this.createOverviewMapCtrl();
    },
    destroyed () {
      this.destroyOverviewMapCtrl();
    },
    methods: {
      /**
       * This function is executed, after the map is bound (see mixins/Mapable).
       * Bind to the layers from the OpenLayers map.
       */
      onMapBound () {
        this.layers = this.map.getLayers().getArray();
        this.createOverviewMapCtrl();
      },
      /**
       * This function is executed, before the map is unbound (see mixins/Mapable)
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
        return this.layers
          .filter(layer => layer.get('isBaseLayer'))
          .reverse()
          .find(layer => layer.getVisible());
      }
    },
    watch: {
      /**
       * Watch for background layer selection change.
       */
      selectedBgLayer () {
        this.overviewMap.setLayer(this.selectedBgLayer);
      }
    }
  }
</script>
