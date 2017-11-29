<template>

    <v-card
      class="wgu-feature-infowindow info-card"
      v-if="this.feature !== null" >

        <v-toolbar class="teal white--text" dark>
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

import { WguEventBus } from '../WguEventBus.js'

export default {
  name: 'wgu-feature-info-window',
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
      attributes: null
    }
  },
  mounted () {
    var me = this;

    // listen to selection events of connected layer and apply attributes
    WguEventBus.$on('map-selectionchange', function (layerName, selected, deselected) {
      if (me.layerId === layerName) {
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
        // TODO replace this ... only debug
        this.attributes.image = 'http://via.placeholder.com/200x200?text=';
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
    bottom: 130px;
    right: 10px;
    width: 300px;
    background-color: white;
  }

</style>
