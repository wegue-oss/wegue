<template>
  <wgu-module-card v-bind="$attrs"
    :moduleName="moduleName"
    class="wgu-attributetable-win" 
    :icon="icon" 
    :title="title"
    v-on:visibility-change="show">

    <template v-slot:wgu-win-toolbar>
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
    </template>
  
    <wgu-attributetable
      v-if="layerId"
      v-resize="onResize"
      :layerId="layerId"
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

export default {
  name: 'wgu-attributetable-win',
  inheritAttrs: false,

  props: {
    icon: {type: String, required: false, default: 'table_chart'},
    title: {type: String, required: false, default: 'Attribute Table'},
    selectorLabel: {type: String, required: false, default: 'Choose a layer'},
    syncTableMapSelection: {type: Boolean, required: false, default: false}
  },
  data () {
    return {
      moduleName: 'wgu-attributetable',
      layerId: null,
      layerItems: null,
      selectedItem: null
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
            layer.get('lid') !== 'measure-layer') {
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
