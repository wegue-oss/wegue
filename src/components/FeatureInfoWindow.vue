<template>

    <v-card
      class="wgu-feature-infowindow info-card"
      v-draggable-win
      v-if="this.feature !== null"
      v-bind:style="{ left: left, top: top }" >

        <v-toolbar class="red darken-3 white--text" dark>
          <v-toolbar-side-icon><v-icon>{{icon}}</v-icon></v-toolbar-side-icon>
          <v-toolbar-title>{{title}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-side-icon @click="onWinXClose"><v-icon>close</v-icon></v-toolbar-side-icon>
        </v-toolbar>

        <v-img v-if="attributes[imageProp]" :src="attributes[imageProp]" :height="imageHeight" />
        <v-card-title primary-title>
          <div>
            <h3 v-if="attributes[titleProp]" class="headline mb-0">{{attributes[titleProp]}}</h3>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn v-if="attributes[infoUrlProp]" flat color="blue" :href="attributes[infoUrlProp]" target="_blank">{{infoUrlText}}</v-btn>
        </v-card-actions>
    </v-card>

</template>

<script>

import { WguEventBus } from '../WguEventBus.js';
import { DraggableWin } from '../directives/DraggableWin.js';

export default {
  name: 'wgu-feature-info-window-win',
  directives: {
    DraggableWin
  },
  props: {
    icon: {type: String, required: false, default: 'info'},
    title: {type: String, required: false, default: 'Feature Info'}
  },
  data () {
    return {
      // will be filled in mounted and when feature clicked
      feature: null,
      attributes: null,
      left: null,
      top: null,
      titleProp: null,
      imageProp: null,
      infoUrlProp: null,
      infoUrlText: null,
      imageHeight: null
    }
  },
  mounted () {
    const config = this.$appConfig.modules['wgu-feature-info-window'] || {};
    this.layers = config.layers;
    this.left = config.initPos ? this.initPos.left + 'px' : '300px';
    this.top = config.initPos ? this.initPos.top + 'px' : '200px';
    var me = this;

    // listen to selection events of connected layer and apply attributes
    WguEventBus.$on('map-selectionchange', function (layerId, selected, deselected) {
      if (selected.length === 0) {
        return;
      }
      const layer = me.findLayer(layerId);
      if (!layer) {
        return;
      }
      // me = {...layer}; TODO How to use Object Spread
      me.layerId = layer.layerId;
      me.titleProp = layer.titleProp;
      me.imageProp = layer.imageProp;
      me.imageHeight = layer.imageHeight || '200px';
      me.infoUrlProp = layer.infoUrlProp;
      me.infoUrlText = layer.infoUrlText || 'More info...';

      me.setFeature(selected[0]);
    });
  },
  methods: {
    /**
     * Sets the feature and its attributes as properties
     * @param {ol.Feature} feature The new feature
     */
    setFeature (feature) {
      this.feature = feature;
      this.attributes = this.feature ? this.feature.getProperties() : null;
    },
    /**
     * Find a layer in our target Layer collection by layer name (layerId).
     * @param {layerId} layerId layer name
     */
    findLayer (layerId) {
      const targetLayerArr = this.layers.filter(layer => layer.layerId === layerId);
      return targetLayerArr.length > 0 ? targetLayerArr[0] : null;
    },
    onWinXClose: function () {
      // this.feature.deselected; TODO: how to deselect Feature on Map?
      this.setFeature(null);
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .wgu-feature-infowindow.info-card {
    position: absolute;
    width: 300px;
    background-color: white;
  }

</style>
