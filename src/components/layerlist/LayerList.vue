<template>
  <v-card class="vwg-layertree" v-if=show>
    <v-toolbar class="teal white--text" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Layers</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-list>
      <v-list-group v-for="item in items" :value="item.active" v-bind:key="item.title">
        <v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title" @click="">
          <input type="checkbox" class="vwg-layer-viz-cb" v-bind:value="subItem.title" v-model="visibleLayers" @change="layerVizChanged">
          <v-list-tile-content>
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
  // Import the EventBus
  import { EventBus } from '../../EventBus.js'

  export default {
    data () {
      return {
        // will be filled in mounted
        items: [],
        // will be filled in mounted and adapted by the layer checkboxes
        visibleLayers: [],

        show: false
      }
    },
    created: function () {
      var me = this
      // Listen to the ol-map-mounted event and receive the OL map instance
      EventBus.$on('ol-map-mounted', function (olMap) {
        // make the OL map accesible in this component
        me.map = olMap
      });

      // Listen to the 'toggle-sub-ui' event of a connected toggle button
      EventBus.$on('toggle-layerlist', function (show) {
        me.show = show;
      });
    },
    mounted: function () {
      // go over all layers from the map and list them up
      var layers = this.map.getLayers();
      // clone to only reverse the order for the list
      var layerArrClone = layers.getArray().slice(0);
      layers = layerArrClone.reverse();

      var layerItems = []
      var visibleLayers = []
      layers.forEach(function (layer) {
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
    methods: {

      /**
       * Handles the 'change' event of the visibility checkboxes of the layers
       */
      layerVizChanged: function () {
        var me = this

        me.map.getLayers().forEach(function (layer) {
          layer.setVisible(false)
        })

        me.visibleLayers.forEach(function (layerNode) {
          var layer = me.getLayersBy('name', layerNode)[0]
          if (layer) {
            layer.setVisible(true)
          }
        })
      },

      /**
       * Returns a set of map layers which matches the given key value pair.
       *
       * @param {String} key - Key to filter layers
       * @param {Object} value - Value to filter layers
       * @return {ol.layer.Base[]} Array of matching layers
       */
      getLayersBy: function (key, value) {
        var layerMatches = []
        var allLayers = this.map.getLayers()
        allLayers.forEach(function (layer) {
          if (layer.get(key) === value) {
            layerMatches.push(layer)
          }
        })

        return layerMatches
      }
    }
  }
</script>

<style>

  .vwg-layertree {
    position: absolute;
    bottom: 130px;
    left: 10px;
    background-color: white;
    z-index: 2;
  }

  .vwg-layer-viz-cb {
    width: 45px;
  }

</style>
