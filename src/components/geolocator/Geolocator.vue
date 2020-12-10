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
      isSearchingForGeolocation: false,
      geolocationMarker: new Style({
        text: new Text({
          text: 'person_pin_circle',
          font: 'normal 30px Material Icons',
          fill: new Fill({
            color: 'blue'
          })
        })
      })
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
    createAndRemoveExistingLayer (layers, layerId) {
      // if the geolocationLayer is already included it has to be removed
      layers.remove(layers.getArray().filter(layer => layerId === (layer.get('lid')))[0]);
      // create new layer
      let layer = new VectorLayer({
        source: new VectorSource(),
        style: this.geolocationMarker
      });
      layer.setProperties({lid: layerId, name: 'Current Position'});
      return layer;
    },

    /**
     *
     */
    geolocateUserAndShowMarkerOnMap () {
      if (this.isGeolocationAPIAvailable) {
        this.isSearchingForGeolocation = true;

        // access current geolocation position and show on map
        navigator.geolocation.getCurrentPosition(position => {
          if (typeof this.map !== 'undefined') {
            // create location point and reproject to map's projection
            const mapProjection = this.map.getView().getProjection();
            const projCoords = fromLonLat([position.coords.longitude, position.coords.latitude], mapProjection);
            const currentPosGeom = new Point(projCoords);

            this.isGeolocationFound = true;
            this.isSearchingForGeolocation = false;
            // get a layer to draw the current position on
            const geolocLayer = this.createAndRemoveExistingLayer(this.map.getLayers(), 'userPosition');
            geolocLayer.getSource().addFeature(new Feature({geometry: currentPosGeom}));
            this.map.addLayer(geolocLayer);

            // collect zooming options
            const zoomOpts = {
              maxZoom: this.maxZoom,
              padding: [50, 50, 50, 50]
            };
            if (this.zoomAnimation) {
              zoomOpts.duration = this.zoomAnimationDuration;
            }
            // zoom to geolocation position
            this.map.getView().fit(currentPosGeom, zoomOpts);
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
