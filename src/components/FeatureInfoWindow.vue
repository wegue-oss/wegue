<template>
  <v-navigation-drawer
      v-if="this.feature !== null"
       class="pb-0 vt-webgis-infowindow"
       permanent
       absolute
       height="100%"
       light
       right
  >
      <v-card
        class="info-card">
         <v-card-media src="http://via.placeholder.com/200x200?text=" height="200px">
         </v-card-media>
         <v-card-title primary-title>
           <div>
             <h3 class="headline mb-0">{{attributes.name}}</h3>
           </div>
         </v-card-title>
         <v-card-actions>
           <v-btn flat class="orange--text">More info...</v-btn>
         </v-card-actions>
    </v-card>

  </v-navigation-drawer>
</template>

<script>

import { EventBus } from '../EventBus.js'

export default {
  name: 'feature-info-window',
  props: {
    layerId: {type: String, required: true}
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
    EventBus.$on('map-selectionchange', function (layerName, selected, deselected) {
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

  .vt-webgis-infowindow {
    padding: 75px 5px 5px 5px
  }

  .vt-webgis-infowindow .info-card {
    background-color: white;
    padding: 5px;
    height: 100%;
  }

</style>
