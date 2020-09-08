<template>
<span>
   <v-btn @click="locateMePressed" icon dark>
      <v-icon v-if='this.isSearchingForPosition'>update</v-icon>
      <v-icon v-else-if='this.isGPSAvailable && (!this.isPositionFixed)'>location_searching</v-icon>
      <v-icon v-else-if='this.isGPSAvailable && this.isPositionFixed'>gps_fixed</v-icon>
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
  name: 'user-locator',
  data: function () {
    return {
      isGPSAvailable: null,
      isPositionFixed: false,
      isSearchingForPosition: false
    }
  },
  created () {
    var me = this;
    WguEventBus.$on('ol-map-mounted', olMap => {
      me.map = olMap;
    });
    if (!navigator.geolocation) {
      me.isGPSAvailable = false;
    } else {
      me.isGPSAvailable = true;
    }
  },
  methods: {
    locateMePressed () {
      var me = this;
      if (me.isGPSAvailable) {
        this.isSearchingForPosition = true;
        setTimeout(function () {
          navigator.geolocation.getCurrentPosition(position => {
            var actualUserCoordinates = new Point(fromLonLat([position.coords.longitude, position.coords.latitude]));
            if (typeof me.map !== 'undefined') {
              me.isPositionFixed = true;
              me.isSearchingForPosition = false;
              // set a point on the map with the actual position
              let myPositionLayer = new VectorLayer({source: new VectorSource(),
                style: function () {
                  return new Style({
                    text: new Text({
                      text: 'person_pin_circle',
                      font: 'normal 30px Material Icons',
                      fill: new Fill({
                        color: 'blue'
                      })
                    })
                  })
                }});
              myPositionLayer.setProperties({lid: 'userPosition', name: 'Benutzerposition'});
              let positionFeature = new Feature({geometry: actualUserCoordinates});
              myPositionLayer.getSource().addFeature(positionFeature);

              me.map.addLayer(myPositionLayer);
              me.map.getView().fit(actualUserCoordinates, {minResolution: 3, duration: 3200, padding: [50, 50, 50, 50]});
            } else {
              console.error('the map is not defined in the getCurrentPosition callback');
            }
          },
          function errorHandler (error) {
            // Log the error without displaying it, simply allows debugging.
            console.error('Geolocation error : code ' + error.code + ' - ' + error.message);
            // Display user friendly error message for the user.
            alert('Geolocation error : code ' + error.code + ' - ' + error.message);
            me.isGPSAvailable = false;
            me.isSearchingForPosition = false;
          },
          {enableHighAccuracy: true, maximumAge: 60000, timeout: 27000})
        }, 1600);
      } else {
        me.isGPSAvailable = false;
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

</style>