<template>

  <v-card v-draggable-win class="wgu-layerlist" v-if=show v-bind:style="{ left: left, top: top }">
    <v-toolbar :color="color" class="" dark>
      <v-toolbar-side-icon><v-icon>{{icon}}</v-icon></v-toolbar-side-icon>
      <v-toolbar-title class="wgu-win-title">{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click="show = false"><v-icon>close</v-icon></v-toolbar-side-icon>
    </v-toolbar>
    <v-list>
      <v-list-group v-for="item in items" :value="item.active" v-bind:key="item.title">
        <v-list-tile class="wgu-layerlist-item" v-for="subItem in item.items" v-bind:key="subItem.title" @click="">
          <input type="checkbox" class="wgu-layer-viz-cb" v-bind:value="subItem.title" v-model="visibleLayers" @change="layerVizChanged">
          <v-list-tile-content class="black--text">
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>{{ subItem.action }}</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>
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
        items: [],
        // will be filled in createLayerItems a. adapted by the layer checkboxes
        visibleLayers: [],
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
        var visibleLayers = []
        layers.forEach(function (layer) {
          // skip if layer should not be listed
          if (layer.get('displayInLayerList') === false) {
            return;
          }
          var visible = layer.getVisible();
          var name = layer.get('name');
          layerItems.push({
            title: name,
            visible: visible
          })

          if (visible) {
            visibleLayers.push(name);
          }
        })

        // set the initial state of visible layers
        this.visibleLayers = visibleLayers

        // set the layer list
        this.items = [{
          title: '',
          items: layerItems,
          active: true
        }]
      },

      /**
       * Handles the 'change' event of the visibility checkboxes of the layers
       */
      layerVizChanged () {
        var me = this

        me.map.getLayers().forEach(function (layer) {
          layer.setVisible(false)
        })

        me.visibleLayers.forEach(function (layerNode) {
          const layer = LayerUtil.getLayersBy('name', layerNode, me.map)[0];
          if (layer) {
            layer.setVisible(true)
          }
        })
      }
    }
  }
</script>

<style>

  .wgu-layerlist {
    background-color: white;
    z-index: 2;
  }
  .v-card.wgu-layerlist {
    position: absolute;
  }

  .wgu-layerlist-item a.v-list__tile {
    padding-left: 0;
  }

  .wgu-layer-viz-cb {
    width: 45px;
  }

  .wgu-layerlist .v-list__group__header {
    display: none;
  }

</style>
