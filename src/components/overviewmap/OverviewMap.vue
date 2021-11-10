<template>
  <div id="wgu-overviewmap-wrapper" />
</template>

<script>
import { Mapable } from '../../mixins/Mapable';
import OverviewMapController from './OverviewMapController';

export default {
  name: 'wgu-overviewmap',
  mixins: [Mapable],
  props: {
  },
  data () {
    return {
      layers: []
    }
  },
  methods: {
    /**
     * This function is executed, after the map is bound (see mixins/Mapable).
     * Bind to the layers from the OpenLayers map.
     */
    onMapBound () {
      this.layers = this.map.getLayers().getArray();
      this.overviewMap = new OverviewMapController(this.map)
    }
  },
  computed: {
    /**
     * Reactive property to return the currently visible OpenLayers background layer.
     * To disambiguate multiple selected background layers - which may occur programmatically -
     * this returns the first in the list of background layers.
     * TODO replace by background-layer-change event
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
};
</script>
