<template>
 <v-card
  class="card--flex-toolbar"
  width="350px"
  style="position: relative; overflow: hidden;"
>
  <v-toolbar card prominent transparent>
    <v-toolbar-title>Search and filter</v-toolbar-title>
    <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template slot="activator">
          <v-btn icon @click="resetSearch" rotate="180">
            <v-icon>settings_backup_restore</v-icon>
          </v-btn>
        </template>
        <span>Reset Search</span>
      </v-tooltip>
  </v-toolbar>
  <v-divider></v-divider>
  
  <v-content>
    <multiselect
      v-model="selectedMultiselectItems"
      :options="featuresForMultiselect"
      :multiple="true"
      :preserve-search="true"
      :closeOnSelect='true'
      openDirection="below"
      label="name"
      track-by="name"
      placeholder="Suchen und Filtern" 
      @select="changeMapViewToSelectedItems"
      @remove="removeFeatureFromSelectedItems"
      >  
    </multiselect>
    <template slot="selection" slot-scope="{ values, search, isOpen }">
         <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">
           {{ values.length }} 
           options selected
          </span>
      </template>  
  </v-content>
</v-card>
</template>

<script>
// Import Data from src/data
import allStores from '../../../app/static/data/parkverkaufsstellen.json';

import { WguEventBus } from '../../WguEventBus.js';
import GeoJSON from 'ol/format/GeoJSON';
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import { Fill, Stroke, Style, Text } from 'ol/style';

import Multiselect from 'vue-multiselect'

let styleForFeature = function (feature) {
  let font = 'normal 20px Material Icons';
  let color = 'rgb(255, 0, 141)';
  let stroke = new Stroke({
    color: 'rgba(255, 255, 255, 0.5)',
    width: 3
  });
  if (feature.values_.TYP === 'Haus') {
    return new Style({
      text: new Text({
        text: 'house',
        font: font,
        stroke: stroke,
        fill: new Fill({
          color: color
        })
      })
    })
  }
  if (feature.values_.TYP === 'Verkaufsstelle') {
    return new Style({
      text: new Text({
        text: 'not_listed_location',
        font: font,
        stroke: stroke,
        fill: new Fill({
          color: color
        })
      })
    })
  }
  if (feature.values_.TYP === 'Post') {
    return new Style({
      text: new Text({
        text: 'local_post_office',
        font: font,
        stroke: stroke,
        fill: new Fill({
          color: color
        })
      })
    })
  }
  if (feature.values_.TYP === 'Tankstelle') {
    return new Style({
      text: new Text({
        text: 'local_gas_station',
        font: font,
        stroke: stroke,
        fill: new Fill({
          color: color
        })
      })
    })
  }
  if (feature.values_.TYP === 'Trafik') {
    return new Style({
      text: new Text({
        text: 'local_offer',
        font: font,
        stroke: stroke,
        fill: new Fill({
          color: color
        })
      })
    })
  }
  if (feature.values_.TYP === 'U-Bahn') {
    return new Style({
      text: new Text({
        text: 'directions_subway',
        font: font,
        stroke: stroke,
        fill: new Fill({
          color: color
        })
      })
    })
  }
  if (feature.values_.TYP === 'Zigarettenautomat') {
    return new Style({
      text: new Text({
        text: 'smoking_rooms',
        font: font,
        stroke: stroke,
        fill: new Fill({
          color: color
        })
      })
    })
  }
}

export default {
  name: 'wgu-app-search',
  components: {
    'multiselect': Multiselect
  },
  data () {
    return {
      storeList: allStores.features,
      selectedMultiselectItems: []
    };
  },
  created () {
    var me = this;
    WguEventBus.$on('ol-map-mounted', olMap => {
      me.map = olMap;
    });
  },
  computed: {
    featuresForMultiselect () {
      return this.storeList.map(object => {
        return {
          id: object.properties.OBJECTID,
          name: `${object.properties.ADRESSE} - ${object.properties.PLZ}`,
          type: object.type,
          feature: object
        };
      });
    }
  },
  methods: {
    changeMapViewToSelectedItems (selectedOption, id) {
      let me = this;
      // set the layer showing every element to invisible
      let itemLayer = me.map.getLayers().getArray().filter(layer => layer.get('lid') === 'Verkaufsstellen')[0];
      itemLayer.setVisible(false);

      let existingSelectedLayer = me.map.getLayers().getArray().filter(layer => layer.get('lid') === 'selectedFeatures')[0];
      let selectedLayer;
      // first time this method is called
      if (existingSelectedLayer == null) {
        selectedLayer = new VectorLayer({source: new VectorSource()});
        selectedLayer.setProperties({lid: 'selectedFeatures',
          name: 'gewählte Objekte',
          'hoverable': true,
          hoverAttribute: 'openhour'});
        me.map.addLayer(selectedLayer);
      } else {
        existingSelectedLayer.getSource().clear();
        selectedLayer = existingSelectedLayer;
      }
      // add the selected feature to the layer
      let selectedObjects = [];
      selectedObjects.push(new GeoJSON().readFeature(selectedOption.feature, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326'
      }));
      me.selectedMultiselectItems.forEach(object => {
        selectedObjects.push(new GeoJSON().readFeature(object.feature, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326'
        }));
      });
      selectedObjects.forEach(item => item.getGeometry().transform('EPSG:4326', 'EPSG:3857'));
      selectedLayer.getSource().addFeatures(selectedObjects);
      selectedLayer.setStyle(styleForFeature);

      let actualExtent = selectedLayer.getSource().getExtent();
      me.map.getView().fit(actualExtent, {
        duration: 1600,
        padding: [10, 500, 10, 10],
        maxZoom: 16
      });
      // tell all other vue components of this change
      me.$emit('filterUpdated', selectedObjects);
    },
    removeFeatureFromSelectedItems (selectedOption, id) {
      let me = this;
      let existingSelectedLayer = me.map.getLayers().getArray().filter(layer => layer.get('lid') === 'selectedFeatures')[0];
      // remove the selectedOption from the ol SelectedSource
      existingSelectedLayer.getSource().forEachFeature(feature => {
        if (selectedOption.feature.properties.OBJECTID === feature.values_.OBJECTID) {
          existingSelectedLayer.getSource().removeFeature(feature);
        }
      });
      // zoom to the view that covers all selected features
      let actualExtent;
      if (existingSelectedLayer.getSource().getFeatures().length === 0) {
        // no features in the Vector Source - use the extend from the source with all features displayed
        let allFeatureLayer = me.map.getLayers().getArray().filter(layer => layer.get('lid') === 'Verkaufsstellen')[0];
        allFeatureLayer.setVisible(true);
        actualExtent = allFeatureLayer.getSource().getExtent();
      } else {
        actualExtent = existingSelectedLayer.getSource().getExtent()
      }
      me.map.getView().fit(actualExtent, {
        duration: 1600,
        padding: [10, 500, 10, 10],
        maxZoom: 16
      });
      // tell all other vue components of this change
      let test = me.selectedMultiselectItems.filter(element => element !== selectedOption);
      me.$emit('filterUpdated', test);
    },
    resetSearch () {
      let me = this;
      let existingSelectedLayer = me.map.getLayers().getArray().filter(layer => layer.get('lid') === 'selectedFeatures')[0];
      // till now no elements have been seleceted
      if (typeof existingSelectedLayer === 'undefined') {
        return;
      }
      existingSelectedLayer.getSource().clear();
      me.selectedMultiselectItems = [];

      let itemLayer = me.map.getLayers().getArray().filter(layer => layer.get('lid') === 'Verkaufsstellen')[0];
      itemLayer.setVisible(true);

      let actualExtent = itemLayer.getSource().getExtent();
      me.map.getView().fit(actualExtent, {
        duration: 1600,
        padding: [50, 50, 50, 50]
      });
      // tell all other vue components of this change
      me.$emit('filterUpdated', me.selectedMultiselectItems);
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

.v-content {
  padding: 0 !important;
}

.multiselect__content-wrapper {
  display: contents;
  overflow: scroll;
}

.multiselect__content {
  height: 50vh;
  overflow: scroll;
  padding: 0;
}

</style>
