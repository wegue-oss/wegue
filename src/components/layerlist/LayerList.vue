<template>
  <v-list v-model:opened="openedListItems">
    <wgu-layerlistitem
      v-for="layer in displayedLayers"
      :key="layer.get('lid')"
      :layer="layer"
      :mapView="map.getView()"
      :showLegends="showLegends"
      :showOpacityControls="showOpacityControls"
      :openedListItems="openedListItems"
    />
  </v-list>
</template>

<script>
import { useMap } from '@/composables/Map';
import LayerListItem from './LayerListItem';

export default {
  name: 'wgu-layerlist',
  components: {
    'wgu-layerlistitem': LayerListItem
  },
  props: {
    showLegends: { type: Boolean, required: true },
    showOpacityControls: { type: Boolean, required: true }
  },
  setup () {
    const { map, layers } = useMap();
    return { map, layers };
  },
  data () {
    return {
      openedListItems: []
    }
  },
  computed: {
    /**
     * Reactive property to return the OpenLayers layers to be shown in the control.
     * Remarks: The 'displayInLayerList' attribute should default to true per convention.
     */
    displayedLayers () {
      return this.layers
        .filter(layer => layer.get('displayInLayerList') !== false && !layer.get('isBaseLayer'))
        .reverse();
    }
  }
};
</script>
