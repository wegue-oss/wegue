<template>

  <v-card v-draggable-win class="wgu-layerlist" v-if=show v-bind:style="{ left: left, top: top }">
    <v-toolbar :color="color" class="" dark>
      <v-toolbar-side-icon><v-icon>{{icon}}</v-icon></v-toolbar-side-icon>
      <v-toolbar-title class="wgu-win-title">{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click="show=false"><v-icon>close</v-icon></v-toolbar-side-icon>
    </v-toolbar>
    <v-list>
      <v-list-tile class="wgu-layerlist-item" v-for="layerItem in layerItems" v-bind:key="layerItem.lid">
        <input type="checkbox" :key="layerItem.lid" class="wgu-layer-viz-cb" v-model="layerItem.visible" @change="layerVizChanged">
        <v-list-tile-content class="black--text">
            <v-list-tile-title>{{ layerItem.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>

</template>

<script>
  import { DraggableWin } from '../../directives/DraggableWin.js';
  import { Mapable } from '../../mixins/Mapable';
  import LayerUtil from '../../util/Layer';

  export default {
    name: 'wgu-layerlist-win',
    directives: {
      DraggableWin
    },
    mixins: [Mapable],
    props: {
      color: {type: String, required: false, default: 'red darken-3'},
      icon: {type: String, required: false, default: 'layers'},
      title: {type: String, required: false, default: 'Layers'}
    },
    data () {
      return {
        moduleName: 'wgu-layerlist',
        // will be filled in createLayerItems
        layerItems: [],
        show: false,
        left: '10px',
        top: '70px'
      }
    },
    methods: {
      /**
       * This function is executed, after the map is bound (see mixins/Mapable)
       */
      onMapBound () {
        var me = this;
        me.createLayerItems();

        // react on added / removed layers
        me.map.getLayers().on('change:length', function (evt) {
          me.createLayerItems();
        });
      },
      /**
       * Creates the layer items from the OpenLayers map.
       */
      createLayerItems () {
        // go over all layers from the map and list them up
        var layers = this.map.getLayers();
        // clone to only reverse the order for the list
        var layerArrClone = layers.getArray().slice(0);
        layers = layerArrClone.reverse();

        var layerItems = []
        layers.forEach(function (layer) {
          // skip if layer should not be listed
          if (layer.get('displayInLayerList') === false) {
            return;
          }
          layerItems.push({
            title: layer.get('name'),
            lid: layer.get('lid'),
            visible: layer.getVisible()
          })
        });

        this.layerItems = layerItems;
      },

      /**
       * Handles the 'change' event of the visibility checkboxes in order to
       * apply the current visibility state in 'data' to the OL layers.
       */
      layerVizChanged () {
        var me = this;

        me.layerItems.forEach(function (layerItem, idx) {
          const layer = LayerUtil.getLayerByLid(layerItem.lid, me.map);
          if (layer) {
            layer.setVisible(layerItem.visible);
          }
        });
      }
    }
  }
</script>

<style>

  .v-card.wgu-layerlist {
    position: absolute;
  }

  .wgu-layer-viz-cb {
    width: 45px;
  }

</style>
