<template>

  <wgu-module-card v-bind="$attrs"
    :moduleName="moduleName"
    class="wgu-infoclick-win" 
    :icon="icon" 
    :title="title"
    :color="color"
    v-on:visibility-change="show">
    <v-card-title primary-title class="wgu-infoclick-win-title">

      <div v-if="!this.attributeData && !this.coordsData" class="no-data">
        Click on the map to get information for the clicked map position.
      </div>

      <!-- feature property grid -->
      <wgu-property-table :properties="attributeData" :color="color" />

      <!-- click coodinate info grid -->
      <wgu-coords-table :coordsData="coordsData" :color="color" />

    </v-card-title>   
   </wgu-module-card>
</template>

<script>
import ModuleCard from './../modulecore/ModuleCard';
import { WguEventBus } from '../../WguEventBus.js';
import PropertyTable from './PropertyTable';
import CoordsTable from './CoordsTable';

export default {
  name: 'wgu-infoclick-win',
  inheritAttrs: false,
  components: {
    'wgu-module-card': ModuleCard,
    'wgu-property-table': PropertyTable,
    'wgu-coords-table': CoordsTable
  },
  props: {
    color: {type: String, required: false, default: 'red darken-3'},
    icon: {type: String, required: false, default: 'info'},
    title: {type: String, required: false, default: 'Map Click Info'}
  },
  data: function () {
    return {
      moduleName: 'wgu-infoclick',
      attributeData: null,
      coordsData: null
    }
  },
  created () {
    var me = this;
    // Listen to the ol-map-mounted event and receive the OL map instance
    WguEventBus.$on('ol-map-mounted', (olMap) => {
      // make the OL map accessible in this component
      me.map = olMap;
    });
  },
  methods: {
    registerMapClick (unregister) {
      var me = this;

      if (unregister === true) {
        me.map.un('singleclick', me.onMapClick);
      } else {
        me.map.on('singleclick', me.onMapClick);
      }
    },
    /**
     * Handler for 'singleclick' on the map.
     * Collects data and passes it to corresponding objects.
     *
     * @param  {ol/MapBrowserEvent} evt The OL event of 'singleclick' on the map
     */
    onMapClick (evt) {
      const me = this;
      let featureLayer = me.map.forEachFeatureAtPixel(evt.pixel,
        (feature, layer) => {
          return [feature, layer];
        });

      // collect feature attributes --> PropertyTable
      if (featureLayer) {
        const feat = featureLayer[0];
        let props = feat.getProperties();
        // do not show geometry property
        delete props.geometry;

        me.attributeData = props;
      } else {
        me.attributeData = null;
      }

      // collect click coordinate + projection --> CoordsTable
      me.coordsData = {
        coordinate: evt.coordinate,
        projection: me.map.getView().getProjection().getCode()
      };
    },
    /**
     * (Un-)Register map interactions when the visibility of the module changes.
     *
     * @param  {boolean} visible New visibility state
    */
    show (visible) {
      const me = this;
      if (visible) {
        me.registerMapClick();
      } else {
        // cleanup old data
        me.attributeData = null;
        me.coordsData = null;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .wgu-infoclick-win {
    width: 450px;
  }

  .wgu-infoclick-win .v-card__title {
    display: inherit;
  }

  @media (max-width: 600px) {
    /* TODO 
      Generalize the positioning concept for windows,
      this interferes with positioning and draggable settings in the app.conf */
      
    /* tmp. approach to position on small screens */
    .wgu-infoclick-win.wgu-floating {
      /* tmp. fix */
      left: 0 !important;
      top: 40% !important;
      width: 100%;
      max-width: 600px;
    }

    .wgu-infoclick-win.wgu-floating > .wgu-infoclick-win-title {
      overflow: scroll;
      max-height: 300px;
    }
  }

</style>
