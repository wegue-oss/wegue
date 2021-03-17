<template>
  <v-card
     class="wgu-attributetable-win"
     v-if="show"
  >

  <v-system-bar
    color="white"
    height="40"
  >
      <v-row>
        <v-col cols="3">
            <v-select
              v-model="selectedItem"
              class="wgu-vector-layer-select"
              :items="layerItems"
              item-text="layerName"
              item-value="lid"
              dense
              return-object
              @input="handleLayerSelect"
            ></v-select>  
        </v-col>
    </v-row>
  </v-system-bar>

  <wgu-attributetable
  v-if="layerId"
  :layerId="layerId"
  >
  </wgu-attributetable>
  <p
  v-if="!layerId"
  >
  This is a placeholder
  </p>

  </v-card>
</template>

<script>
import { Mapable } from '../../mixins/Mapable';
import VectorLayer from 'ol/layer/Vector'
import AttributeTable from './AttributeTable';

export default {
  name: 'wgu-attributetable-win',
  data () {
    return {
      show: false,
      layerId: null,
      layerItems: null,
      selectedItem: null
    }
  },
  mixins: [Mapable],
  components: {
    'wgu-attributetable': AttributeTable
  },
  methods: {
    handleLayerSelect () {
      this.layerId = this.selectedItem.lid;
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

.wgu-attributetable-win {
    width: 100%;
    bottom: 80px;
    max-height: 40%;
}
</style>
