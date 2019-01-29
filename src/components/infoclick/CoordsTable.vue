<template>

  <table class="coords" v-if="coordRows" :style="tableStyles">
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
    coordsData: {type: Object}
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

      var coordinateWgs84 =
          transform(coordinate, projection, 'EPSG:4326');
      var hdms = toStringHDMS(coordinateWgs84);

      me.coordRows = {
        'POS': coordinate[1].toFixed(2) + ' ' + coordinate[0].toFixed(2),
        'WGS 84': coordinateWgs84[1].toFixed(7) + ' ' + coordinateWgs84[0].toFixed(7),
        'HDMS': hdms
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.wgu-infoclick-win table.coords {
  margin-top: 12px;
  width: 100%;
}

</style>
