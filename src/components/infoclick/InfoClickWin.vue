<template>

  <v-card v-draggable-win class="wgu-infoclick-win" v-if=show v-bind:style="{ left: left, top: top }">
    <v-toolbar :color="color" class="" dark>
      <v-toolbar-side-icon><v-icon>{{icon}}</v-icon></v-toolbar-side-icon>
      <v-toolbar-title class="wgu-win-title">{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click="show = false"><v-icon>close</v-icon></v-toolbar-side-icon>
    </v-toolbar>
    <v-card-title primary-title>

      <div v-if="this.gridData === null && this.coordsData === null" class="no-data">
        Click on the map to get information for the clicked map position.
      </div>

      <!-- feature property grid -->
      <table v-if="this.gridData !== null" :style="tableStyles">
        <thead>
          <tr>
            <th v-for="entry in gridData"
            </th>
          </tr>
        </thead>
        <tbody class="attr-tbody">
          <tr v-for="(value, key) in gridData">
            <td>
              {{key}}
            </td>
            <td>
              {{value}}
            </td>
          </tr>
        </tbody>
      </table>

<<<<<<< HEAD
      <table class="coords" v-if="this.coordsData !== null" :style="tableStyles">
        <thead>
          <tr>
            <th v-for="entry in coordsData"
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key) in coordsData">
            <td>
              {{key}}
            </td>
            <td>
              {{value}}
            </td>
          </tr>
        </tbody>
      </table>
=======
      <!-- click coodinate info grid -->
      <wgu-coords-table :coordsData="coordsData" :color="color" />
>>>>>>> 08eed3b... Separate CoordsTable into own component

    </v-card-title>
  </v-card>

</template>

<script>
// helper function to detect a CSS color
// Taken from Vuetify sources
// https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/mixins/colorable.ts
function isCssColor (color) {
  return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
}

import vColors from 'vuetify/es5/util/colors';
import { WguEventBus } from '../../WguEventBus.js';
import CoordsTable from './CoordsTable';

export default {
  name: 'wgu-infoclick-win',
  components: {
    'wgu-coords-table': CoordsTable
  },
  props: {
    color: {type: String, required: false, default: 'red darken-3'},
    icon: {type: String, required: false, default: 'info'},
    title: {type: String, required: false, default: 'Map Click Info'}
  },
  data: function () {
    return {
      show: false,
      left: '2px',
      top: '270px',
      gridData: null,
      coordsData: null
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
  created () {
    var me = this;
    // Listen to the ol-map-mounted event and receive the OL map instance
    WguEventBus.$on('ol-map-mounted', (olMap) => {
      // make the OL map accesible in this component
      me.map = olMap;
    });
  },
  methods: {
    toggleUi () {
      this.show = !this.show;
    },
    registerMapClick () {
      var me = this;

      me.map.on('singleclick', (evt) => {
        var featureLayer = me.map.forEachFeatureAtPixel(evt.pixel,
          function (feature, layer) {
            return [feature, layer];
          });

        if (featureLayer) {
          var feat = featureLayer[0];
          var props = feat.getProperties();

          delete props.geometry;

          me.gridData = props;
        } else {
          me.gridData = null;
        }

        // collect click coordinate + projection --> CoordsTable
        me.coordsData = {
          coordinate: evt.coordinate,
          projection: me.map.getView().getProjection().getCode()
        };
      });
    }
  },
  watch: {
    show () {
      if (this.show === true) {
        this.registerMapClick();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .wgu-infoclick-win {
    background-color: white;
    z-index: 2;
  }

  .v-card.wgu-infoclick-win {
      position: absolute;
  }

  .wgu-infoclick-win .v-card__title {
    display: inherit;
  }

  .wgu-infoclick-win table {
    border-radius: 3px;
    background-color: #fff;
  }

  .wgu-infoclick-win .attr-tbody {
    display: block;
    max-height: 300px;
    overflow-y: scroll;
  }

  .wgu-infoclick-win td {
    background-color: #f9f9f9;
  }

  .wgu-infoclick-win th, .wgu-infoclick-win td {
    width: 200px;
    padding: 10px 20px;
  }

  .wgu-infoclick-win th.active {
    color: #fff;
  }

</style>
