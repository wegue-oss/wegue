<template>

  <table 
    :class="{
      'wgu-coordstable': true,
      'light-theme': !isDark,
      'dark-theme': isDark
    }"
    v-if="coordRows"
    style="border: 2px solid var(--v-secondary-base);"
  >
    <thead>
      <tr>
        <th v-for="(entry, key) in coordRows" :key="key">
        </th>
      </tr>
    </thead>
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
  </table>

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
  computed: {
    /**
     * Checks if color theme is in dark mode
     */
    isDark: function () {
      return this.$vuetify.theme.dark;
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

table.wgu-coordstable {
  margin-top: 12px;
  width: 100%;
}

.wgu-coordstable table {
  border-radius: 3px;
}

.wgu-coordstable.dark-theme td {
  background-color: hsla(0, 0%, 98%, 0.03);
}

.wgu-coordstable.light-theme td {
  background-color: hsla(0, 0%, 98%, 1);
}

.wgu-coordstable tr {
  font-size: 16px;
}

.wgu-coordstable th, .wgu-coordstable td {
  width: 200px;
  padding: 5px 5px;
}

.wgu-coordstable td.key-td {
  width: 160px;
  padding: 5px 5px;
}

</style>
