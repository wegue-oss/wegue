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
        </v-toolbar>

        <v-card-media v-if="attributes[imageProp]" :src="attributes[imageProp]" height="200px" />
        <v-card-title primary-title>
          <div>
            <h3 v-if="attributes[titleProp]" class="headline mb-0">{{attributes[titleProp]}}</h3>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat class="orange--text">More info...</v-btn>
        </v-card-actions>
    </v-card>

</template>

<script>

import { WguEventBus } from '../WguEventBus.js';
import { DraggableWin } from '../directives/DraggableWin.js';

export default {
  name: 'wgu-feature-info-window',
  directives: {
    DraggableWin
  },
  props: {
    layerId: {type: String, required: true},
    imageProp: {type: String, required: false},
    titleProp: {type: String, required: false},
    icon: {type: String, required: false},
    title: {type: String, required: false}
  },
  data () {
    return {
      // will be filled in mounted
      feature: null,
      attributes: null,
      left: '300px',
      top: '200px'
    }
  },
  mounted () {
    var me = this;

    // listen to selection events of connected layer and apply attributes
    WguEventBus.$on('map-selectionchange', function (layerId, selected, deselected) {
      if (me.layerId === layerId) {
        me.setFeature(selected[0]);
      }
    });
  },
  methods: {
    /**
     * Sets the feature and its attributes as properties
     * @param {ol.Feature} feature The new feature
     */
    setFeature (feature) {
      if (feature) {
        this.feature = feature;
        this.attributes = feature.getProperties();
      } else {
        this.feature = null;
        this.attributes = null;
      }
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
