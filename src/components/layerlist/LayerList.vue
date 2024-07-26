<template>

  <v-list expand>
    <wgu-layerlistitem
      v-for="layer in displayedLayers"
      :key="layer.get('lid')"
      :layer="layer.getLayer()"
      :mapView="map.getView()"
      :showLegends="showLegends"
      :showOpacityControls="showOpacityControls"
    />
  </v-list>
</template>

<script>
import { LayerCollectionProxy } from '@/util/Layer';
import { Mapable } from '../../mixins/Mapable';
import LayerListItem from './LayerListItem'

export default {
  name: 'wgu-layerlist',
  components: {
    'wgu-layerlistitem': LayerListItem
  },
  mixins: [Mapable],
  props: {
    showLegends: { type: Boolean, required: true },
    showOpacityControls: { type: Boolean, required: true }
  },
  data () {
    return {
      layersProxy: undefined
    }
  },
  methods: {
    /**
     * This function is executed, after the map is bound (see mixins/Mapable).
     * Bind to the layers from the OpenLayers map.
     */
    onMapBound () {
      this.layersProxy = new LayerCollectionProxy(this.map.getLayers(),
        ['lid', 'displayInLayerList', 'isBaseLayer']);
    }
  },
  destroyed () {
    this.layersProxy.destroy();
  },
  computed: {
    /**
     * Reactive property to return the OpenLayers layers to be shown in the control.
     * Remarks: The 'displayInLayerList' attribute should default to true per convention.
     */
    displayedLayers () {
      if (!this.layersProxy) {
        return [];
      }
      return this.layersProxy.getArray()
        .filter(layer => layer.get('displayInLayerList') !== false && !layer.get('isBaseLayer'))
        .reverse();
    }
  }
}
</script>
