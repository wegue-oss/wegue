<template>
  <v-card class="vwg-layertree">
    <v-toolbar class="teal white--text" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Layers</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn> -->
    </v-toolbar>
    <v-list>
      <v-list-group v-for="item in items" :value="item.active" v-bind:key="item.title">
        <v-list-tile slot="item" @click="">
          <v-list-tile-action>
            <v-icon>{{ item.action }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>keyboard_arrow_down</v-icon>
          </v-list-tile-action>
        </v-list-tile>
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
  import { EventBus } from '../EventBus.js'

  export default {
    data () {
      return {
        // will be filled in mounted
        items: [],
        // will be filled in mounted and adapted by the layer checkboxes
        visibleLayers: []
      }
    },
    created: function () {
      var me = this
      // Listen for the ol-map-mounted event ans receive the OL map instance
      EventBus.$on('ol-map-mounted', function (olMap) {
        // make the OL map accesible in this component
        me.map = olMap
      })
    },
    mounted: function () {
      // go over all layers from the map and list them up
      var layers = this.map.getLayers()

      var layerItems = []
      var visibleLayers = []
      layers.forEach(function (layer) {
        layerItems.push({
          title: layer.get('name'),
          visible: layer.getVisible()
        })

        visibleLayers.push(layer.get('name'))
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
