<template>

  <table class="wgu-coordstable" v-if="coordRows" :style="tableStyles">
    <thead>
      <tr>
        <th v-for="entry in coordRows"
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, key) in coordRows">
        <td class="key-td">
          {{key}}
        </td>
        <td class="val-td">
          {{value}}
        </td>
      </tr>
    </tbody>
  </table>

</template>

<script>
// helper function to detect a CSS color
// Taken from Vuetify sources
// https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/mixins/colorable.ts
function isCssColor (color) {
  return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
}

import vColors from 'vuetify/es5/util/colors';
import {transform} from 'ol/proj.js';
import {toStringHDMS} from 'ol/coordinate';

export default {
  name: 'wgu-coords-table',
  props: {
    color: {type: String, required: false, default: 'red darken-3'},
    coordsData: {type: Object},
    showMapPos: {type: Boolean, required: false, default: true},
    showWgsPos: {type: Boolean, required: false, default: true},
    showHdms: {type: Boolean, required: false, default: true}
  },
  data: function () {
    return {
      coordRows: null
    }
  },
  computed: {
    tableStyles () {
      // calculate border color of tables due to current color property
      let borderColor = this.color;
      if (!isCssColor(this.color)) {
        let [colorName, colorModifier] = this.color.toString().trim().split(' ', 2);
        borderColor = vColors[colorName];
        if (colorModifier) {
          colorModifier = colorModifier.replace('-', '');
          borderColor = vColors[colorName][colorModifier];
        }
      }
      return {
        'border': '2px solid ' + borderColor
      };
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
        // show coordinate in WGS 84 as formatted deegree / min / secs
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

table.wgu-coordstable {
  margin-top: 12px;
  width: 100%;
}

.wgu-coordstable table {
  border-radius: 3px;
  background-color: #fff;
}

.wgu-coordstable td {
  background-color: #f9f9f9;
}

.wgu-coordstable th, .wgu-coordstable td {
  width: 200px;
  padding: 10px 20px;
}

</style>
