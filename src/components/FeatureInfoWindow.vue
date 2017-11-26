<template>
  <v-navigation-drawer
      v-if="this.feature !== null"
       class="pb-0 wgu-feature-infowindow"
       permanent
       absolute
       height="100%"
       light
       right
  >
      <v-card
        class="info-card">
         <v-card-media v-if="attributes[imageProp]" :src="attributes[imageProp]" height="200px">
         </v-card-media>
         <v-card-title primary-title>
           <div>
             <h3 v-if="attributes[titleProp]" class="headline mb-0">{{attributes[titleProp]}}</h3>
           </div>
         </v-card-title>
         <v-card-actions>
           <v-btn flat class="orange--text">More info...</v-btn>
         </v-card-actions>
    </v-card>

  </v-navigation-drawer>
</template>

<script>

import { WguEventBus } from '../WguEventBus.js'

export default {
  name: 'wgu-feature-info-window',
  props: {
    layerId: {type: String, required: true},
    imageProp: {type: String, required: false},
    titleProp: {type: String, required: false}
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

  .wgu-feature-infowindow {
    padding: 75px 5px 5px 5px
  }

  .wgu-feature-infowindow .info-card {
    background-color: white;
    padding: 5px;
    height: 100%;
  }

</style>
