<template>

  <v-card class="wgu-measurewin" v-draggable-win v-if="show" v-bind:style="{ left: left, top: top }">
    <v-toolbar :color="color" class="" dark>
      <v-toolbar-side-icon><v-icon>{{ icon }}</v-icon></v-toolbar-side-icon>
      <v-toolbar-title class="wgu-win-title">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click="show=false"><v-icon>close</v-icon></v-toolbar-side-icon>
    </v-toolbar>

    <v-card-title primary-title>

      <!-- toggle button to choose measure type -->
      <wgu-measure-type-chooser
        :measureType="measureType"
        @wgu-measuretype-change="applyMeasureType"
      />

    </v-card-title>

    <v-card-actions>

      <!-- result display -->
      <wgu-measure-result :measureGeom="measureGeom" />

    </v-card-actions>
  </v-card>

</template>

<script>
  import { DraggableWin } from '../../directives/DraggableWin';
  import { Mapable } from '../../mixins/Mapable';
  import MeasureTypeChooser from './MeasureTypeChooser';
  import MeasureResult from './MeasureResult';
  import OlMeasureController from './OlMeasureController';

  export default {
    name: 'wgu-measuretool-win',
    directives: {
      DraggableWin
    },
    components: {
      'wgu-measure-type-chooser': MeasureTypeChooser,
      'wgu-measure-result': MeasureResult
    },
    mixins: [Mapable],
    props: {
      color: {type: String, required: false, default: 'red darken-3'},
      icon: {type: String, required: false, default: 'photo_size_select_small'},
      title: {type: String, required: false, default: 'Measure'}
    },
    data () {
      return {
        moduleName: 'wgu-measuretool',
        measureGeom: null,
        measureType: 'distance',
        show: false,
        left: '10px',
        top: '70px'
      }
    },
    watch: {
      show () {
        var me = this;
        if (me.show === true) {
          me.olMapCtrl.addInteraction(me.measureType, me.onMeasureVertexSet);
        } else {
          me.olMapCtrl.removeInteraction();
        }
      },
      measureType () {
        var me = this;
        // reset old geom
        me.measureGeom = {};
        me.olMapCtrl.addInteraction(me.measureType, me.onMeasureVertexSet);
      }
    },
    methods: {
      /**
       * Applies the changed measure value to this.measureType.
       * Called as callback of MeasureTypeChooser
       *
       * @param  {String} newMeasureType New measure type
       * @param  {String} oldMeasureType Old measure type
       */
      applyMeasureType (newMeasureType, oldMeasureType) {
        this.measureType = newMeasureType;
      },
      /**
       * This function is executed, after the map is bound (see mixins/Mapable)
       */
      onMapBound () {
        const me = this;
        const measureConf = me.$appConfig.modules[me.moduleName] || {};
        this.olMapCtrl = new OlMeasureController(me.map, measureConf);

        me.olMapCtrl.createMeasureLayer();
      },
      /**
       * Callback function executed when user sets a measure point on the map.
       *
       * @param  {ol/geom/Geometry} geom The geometry object of the map
       */
      onMeasureVertexSet (geom) {
        // wrap geom into object, otherwise the injection into childs does
        // not work. Maybe the OL object does not feel changed for Vue
        this.measureGeom = {
          geom: geom
        };
      }
    }
  }
</script>

<style>

  .wgu-measurewin {
    background-color: white;
    z-index: 2;
  }

  .v-card.wgu-measurewin {
    position: absolute;
  }

</style>
