<template>
  <v-card
     class="wgu-attributetable"
     v-if="show"
  >

  <v-system-bar
    color="white"
    height="40"
  >
    <v-select
      :items="layerItems"
      item-text="layerName"
      item-value="lid"
      dense
      return-object
      @input="handleLayerSelect"
    ></v-select>  
  </v-system-bar>

  <wgu-attributetable
  v-if="layerId"
  :layerId="layerId"
  >
  </wgu-attributetable>

  </v-card>
</template>

<script>
import { Mapable } from '../../mixins/Mapable';
import VectorLayer from 'ol/layer/Vector'
import AttributeTable from './AttributeTable';

// TODO: set default selection
//       - maybe with v-model

export default {
  name: 'wgu-attributetable-win',
  data () {
    return {
      show: false,
      layerId: null,
      layerItems: null
    }
  },
  mixins: [Mapable],
  components: {
    'wgu-attributetable': AttributeTable
  },
  methods: {
    handleLayerSelect (layerItem) {
      this.layerId = layerItem.lid;
    },
    onMapBound () {
      this.populateLayerItems();
    },
    /**
     * Finds vector layers and adds them to
     * the selection menu.
     */
    populateLayerItems () {
      let layerItems = [];

      const mapLayers = this.map.getLayers();
      mapLayers.forEach(layer => {
        if (layer instanceof VectorLayer) {
          layerItems.push({
            layerName: layer.get('name'),
            lid: layer.get('lid')
          });
        }
      });

      this.layerItems = layerItems
    }
  }
};
</script>

<style scoped>
.wgu-attributetable {
  position: absolute;
  top: 90px;
  left: 16px;
  z-index: 2;
}
</style>
