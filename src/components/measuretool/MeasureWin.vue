<template>

  <v-card class="wgu-measurewin" v-draggable-win="draggable" v-if="show" v-bind:style="{ left: left, top: top }">
    <v-toolbar :color="color" class="" dark>
      <v-icon>{{ icon }}</v-icon>
      <v-toolbar-title class="wgu-win-title">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click="show=false"><v-icon>close</v-icon></v-app-bar-nav-icon>
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
      title: {type: String, required: false, default: 'Measure'},
      draggable: {type: Boolean, required: false, default: true},
      initPos: {type: Object, required: false}
    },
    data () {
      return {
        moduleName: 'wgu-measuretool',
        measureGeom: null,
        measureType: 'distance',
        show: false,
        left: this.initPos ? this.initPos.left + 'px' : '0',
        top: this.initPos ? this.initPos.top + 'px' : '0'
      }
    },
    destroy () {
      if (this.olMapCtrl) {
        this.olMapCtrl.destroy();
        this.olMapCtrl = undefined;
      }
    },
    watch: {
      show () {
        if (!this.olMapCtrl) {
          return;
        }
        if (this.show === true) {
          this.olMapCtrl.addInteraction(this.measureType, this.onMeasureVertexSet);
        } else {
          this.olMapCtrl.removeInteraction();
        }
      },
      measureType () {
        if (!this.olMapCtrl) {
          return;
        }
        // reset old geom
        this.measureGeom = {};
        this.olMapCtrl.addInteraction(this.measureType, this.onMeasureVertexSet);
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
        if (this.unbound) {
          return;
        }
        // Only create if specified in config
        if (!this.$appConfig.modules || !this.$appConfig.modules[this.moduleName]) {
          return;
        }
        const measureConf = this.$appConfig.modules[this.moduleName] || {};
        this.olMapCtrl = new OlMeasureController(this.map, measureConf);

        this.olMapCtrl.createMeasureLayer();
      },
      /**
       * This function is executed, after the map is bound (see mixins/Mapable)
       */
      onMapUnbound () {
        if (this.olMapCtrl) {
          this.olMapCtrl.destroy();
          this.olMapCtrl = undefined;
        }
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
