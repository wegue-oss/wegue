<template>

  <v-list>
    <v-list-item class="wgu-layerlist-item" v-for="layerItem in layerItems" v-bind:key="layerItem.lid" @click="onItemClick($event, layerItem)">
      <input type="checkbox" :key="layerItem.lid" class="wgu-layer-viz-cb" v-model="layerItem.visible" @change="layerVizChanged">
      <v-list-item-content class="black--text">
          <v-list-item-title>{{ layerItem.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>

</template>

<script>
  import { Mapable } from '../../mixins/Mapable';
  import LayerUtil from '../../util/Layer';

  export default {
    name: 'wgu-layerlist',
    mixins: [Mapable],
    props: {
    },
    data () {
      return {
        layerItems: [],
        changeVisByClickUpdate: false
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
        const me = this;
        // go over all layers from the map and list them up
        var layers = this.map.getLayers();
        // clone to only reverse the order for the list
        var layerArrClone = layers.getArray().slice(0);
        layers = layerArrClone.reverse();

        var layerItems = [];
        layers.forEach(function (layer) {
          // skip if layer should not be listed
          if (layer.get('displayInLayerList') === false ||
              layer.get('isBaseLayer') === true) {
            return;
          }
          layerItems.push({
            title: layer.get('name'),
            lid: layer.get('lid'),
            visible: layer.getVisible()
          });

          // synchronize visibility with UI when changed programatically
          layer.on('change:visible', me.onOlLayerVizChange);
        });

        me.layerItems = layerItems;
      },

      /**
       * Handles the 'change:visible' event of the layer in order to
       * apply the current visibility state to the corresponding checkbox in
       * case the 'change:visible' wasn't triggered by click.
       *
       * @param  {ol/Object.ObjectEvent} evt The OL event of 'change:visible'
       */
      onOlLayerVizChange (evt) {
        const me = this;
        if (!me.changeVisByClickUpdate) {
          me.layerItems.forEach(function (layerItem, idx) {
            if (layerItem.lid === evt.target.get('lid')) {
              // execute click handler to change visibility
              me.onItemClick(null, layerItem);
            }
          });
        }
      },

      /**
       * Handler for click on item in layer list:
       * Toggles the corresponding visibility and calls this.layerVizChanged.
       *
       * @param  {Object} ect       Original vue click event
       * @param  {Object} layerItem Layer item data object
       */
      onItemClick (evt, layerItem) {
        const me = this;
        layerItem.visible = !layerItem.visible;

        me.changeVisByClickUpdate = true;
        this.layerVizChanged();
        me.changeVisByClickUpdate = false;
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

  .wgu-layer-viz-cb {
    width: 45px;
  }

</style>
