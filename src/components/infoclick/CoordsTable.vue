<template>

  <v-card-text class="px-0" v-if="coordRows">
    <v-simple-table class="wgu-coordstable">
      <tbody>
        <tr v-for="(value, key) in coordRows" :key="key">
          <td class="key-td">
            {{key}}
          </td>
          <td class="val-td">
            {{value}}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card-text>

</template>

<script>

import { transform } from 'ol/proj.js';
import { toStringHDMS } from 'ol/coordinate';

export default {
  name: 'wgu-coords-table',
  props: {
    coordsData: { type: Object },
    showMapPos: { type: Boolean, required: false, default: true },
    showWgsPos: { type: Boolean, required: false, default: true },
    showHdms: { type: Boolean, required: false, default: true }
  },
  data: function () {
    return {
      coordRows: null
    }
  },
  methods: {
  },
  watch: {
    coordsData () {
      const me = this;
      const coordinate = me.coordsData.coordinate;
      const projection = me.coordsData.projection;
      const coordinateWgs84 = transform(coordinate, projection, 'EPSG:4326');
      let coordRows = {};

      if (me.showMapPos) {
        // show coordinate in map' SRS
        coordRows['MAP PROJ'] =
          coordinate[1].toFixed(2) + ' ' + coordinate[0].toFixed(2);
      }
      if (me.showWgsPos) {
        // show coordinate in WGS 84
        const coordinateWgs84 = transform(coordinate, projection, 'EPSG:4326');
        coordRows['WGS 84'] =
          coordinateWgs84[1].toFixed(7) + '° ' + coordinateWgs84[0].toFixed(7) + '°'
      }
      if (me.showHdms) {
        // show coordinate in WGS 84 as formatted degree / min / secs
        const hdms = toStringHDMS(coordinateWgs84);
        coordRows['HDMS'] = hdms
      }

      me.coordRows = coordRows;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.wgu-coordstable {
  word-break: break-word;
}

.wgu-coordstable td.key-td {
  width: 40%;
}
</style>
