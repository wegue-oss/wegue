<template>
<span>
   <v-btn @click="geolocateUserAndShowMarkerOnMap" icon dark>
      <v-icon v-if='this.isSearchingForGeolocation'>update</v-icon>
      <v-icon v-else-if='this.isGeolocationAPIAvailable && (!this.isGeolocationFound)'>location_searching</v-icon>
      <v-icon v-else-if='this.isGeolocationAPIAvailable && this.isGeolocationFound'>gps_fixed</v-icon>
      <v-icon v-else>location_disabled</v-icon>
    </v-btn>
</span>
</template>

<script>
import {fromLonLat} from 'ol/proj'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature';
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import { Fill, Style, Text } from 'ol/style';

import { WguEventBus } from '../../WguEventBus'

// definition for the geolocation marker of the device on the map
const geolocationMarker = new Style({
  text: new Text({
    text: 'person_pin_circle',
    font: 'normal 30px Material Icons',
    fill: new Fill({
      color: 'blue'
    })
  })
});

/**
 *
 */
function createAndRemoveExistingLayer (layers, layerId) {
  // if the geolocationLayer is already included it has to be removed
  layers.remove(layers.getArray().filter(layer => layerId === (layer.get('lid')))[0]);
  // create new layer
  let layer = new VectorLayer({
    source: new VectorSource(),
    style: geolocationMarker
  });
  layer.setProperties({lid: layerId, name: 'Current Position'});
  return layer;
};

/**
 *
 */
function addPointToLayer (point, layer) {
  layer.getSource().addFeature(new Feature({geometry: point}));
};

export default {
  name: 'wgu-geolocator',
  props: {
    zoomAnimation: {type: Boolean, required: false, default: true},
    zoomAnimationDuration: {type: Number, required: false, default: 2400},
    maxZoom: {type: Number, required: false, default: 15}
  },
  data: function () {
    return {
      isGeolocationAPIAvailable: null,
      isGeolocationFound: false,
      isSearchingForGeolocation: false
    }
  },
  created () {
    const me = this;
    WguEventBus.$on('ol-map-mounted', olMap => {
      me.map = olMap;
    });
    if (!navigator.geolocation) {
      me.isGeolocationAPIAvailable = false;
    } else {
      me.isGeolocationAPIAvailable = true;
    }
  },
  methods: {
    /**
     *
     */
    geolocateUserAndShowMarkerOnMap () {
      if (this.isGeolocationAPIAvailable) {
        this.isSearchingForGeolocation = true;

        // access current geolocation position and show on map
        navigator.geolocation.getCurrentPosition(position => {
          const currentPosition = new Point(fromLonLat([position.coords.longitude, position.coords.latitude]));
          if (typeof this.map !== 'undefined') {
            this.isGeolocationFound = true;
            this.isSearchingForGeolocation = false;
            // get a Layer to put the currentPosition on
            const geolocationLayer = createAndRemoveExistingLayer(this.map.getLayers(), 'userPosition');
            addPointToLayer(currentPosition, geolocationLayer);
            this.map.addLayer(geolocationLayer);

            // collect zooming options
            const zoomOpts = {
              maxZoom: this.maxZoom,
              padding: [50, 50, 50, 50]
            };
            if (this.zoomAnimation) {
              zoomOpts.duration = this.zoomAnimationDuration;
            }
            // zoom to geolocation position
            this.map.getView().fit(currentPosition, zoomOpts);
          } else {
            console.error('The map is not defined in the getCurrentPosition callback');
          }
        },
        // error handling for geolocation
        error => {
          // log the error without displaying it, simply allows debugging
          console.error('Geolocation error : code ' + error.code + ' - ' + error.message);
          // display user friendly error message
          alert('Geolocation error : code ' + error.code + ' - ' + error.message);
          this.isGeolocationAPIAvailable = false;
          this.isSearchingForGeolocation = false;
        },
        {enableHighAccuracy: true, maximumAge: 60000, timeout: 27000})
      } else {
        this.isGeolocationAPIAvailable = false;
      }
    }
  }
}
</script>

<style scoped>

</style>
