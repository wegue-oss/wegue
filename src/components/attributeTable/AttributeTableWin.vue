<template>
  <v-card
     class="wgu-attributetable-win"
     v-if="show"
  >
    <v-toolbar :color="color" dark>
      <v-icon>{{icon}}</v-icon>
      <v-toolbar-title
        class="wgu-win-title"
        v-if="!$vuetify.breakpoint.xs"
      >{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-select
          v-model="selectedItem"
          class="wgu-vector-layer-select"
          :items="layerItems"
          item-text="layerName"
          item-value="lid"
          dense
          return-object
          hide-details
          @input="handleLayerSelect"
          :label="selectorLabel"
        ></v-select>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click="show=false">
        <v-icon>close</v-icon>
      </v-app-bar-nav-icon>
  </v-toolbar>

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

export default {
  name: 'wgu-attributetable-win',

  props: {
    color: {type: String, required: false, default: 'red darken-3'},
    icon: {type: String, required: false, default: 'table_chart'},
    title: {type: String, required: false, default: 'Attribute Table'},
    selectorLabel: {type: String, required: false, default: 'Choose a layer'}
  },
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
    /**
     * Store selected layerId in the respective
     * variable of the component.
     */
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
        if (layer instanceof VectorLayer &&
            layer.get('name') !== 'Measure Layer') {
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
    z-index: 2;
    bottom: 35px;
}

@media only screen and (max-width: 600px) {
  .wgu-attributetable-win {
      z-index: 2;
      bottom: 33px;
      height: 100%;
  }
}
</style>
