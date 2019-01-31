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
  import DrawInteraction from 'ol/interaction/Draw';
  import {unByKey} from 'ol/Observable.js';
  import VectorSource from 'ol/source/Vector';
  import VectorLayer from 'ol/layer/Vector';
  import Style from 'ol/style/Style';
  import Stroke from 'ol/style/Stroke';
  import Circle from 'ol/style/Circle';
  import Fill from 'ol/style/Fill';
  import { DraggableWin } from '../../directives/DraggableWin';
  import { Mapable } from '../../mixins/Mapable';
  import MeasureTypeChooser from './MeasureTypeChooser';
  import MeasureResult from './MeasureResult';

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
          me.addInteraction();
        } else {
          me.removeInteraction();
        }
      },
      measureType () {
        this.addInteraction();
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
        this.createMeasureLayer();
      },
      /**
       * Creates a vector layer for the measurement results and adds it to the
       * map.
       */
      createMeasureLayer () {
        const me = this;
        const measureConf = me.$appConfig.modules[me.moduleName] || {};
        // create a vector layer to
        var source = new VectorSource();
        var vector = new VectorLayer({
          name: 'Measure Layer',
          displayInLayerList: false,
          source: source,
          style: new Style({
            fill: new Fill({
              color: measureConf.fillColor || 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
              color: measureConf.strokeColor || 'rgba(0, 0, 0, 0.5)',
              width: 2
            })
          })
        });

        me.map.addLayer(vector);

        // make vector source available as member
        me.source = source;
      },
      /**
       * Creates and adds the necessary draw interaction and adds it to the map.
       */
      addInteraction (newMeasureType) {
        const me = this;
        const measureConf = me.$appConfig.modules[me.moduleName] || {};
        // cleanup possible old draw interaction
        if (me.draw) {
          me.removeInteraction();
        }

        var type = (me.measureType === 'area' ? 'Polygon' : 'LineString');
        var draw = new DrawInteraction({
          source: me.source,
          type: type,
          style: new Style({
            fill: new Fill({
              color: measureConf.sketchFillColor || 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
              color: measureConf.sketchStrokeColor || 'rgba(0, 0, 0, 0.5)',
              lineDash: [10, 10],
              width: 2
            }),
            image: new Circle({
              radius: 5,
              stroke: new Stroke({
                color: measureConf.sketchVertexStrokeColor || 'rgba(0, 0, 0, 0.7)'
              }),
              fill: new Fill({
                color: measureConf.sketchVertexFillColor || 'rgba(255, 255, 255, 0.2)'
              })
            })
          })
        });
        me.map.addInteraction(draw);

        var listener;
        var sketch;
        draw.on('drawstart', (evt) => {
          // clear old measure features
          me.source.clear();
          // preserve sketch
          sketch = evt.feature;

          listener = me.map.on('click', (evt) => {
            const geom = sketch.getGeometry();
            // wrap geom into object, otherwise the injection into childs does
            // not work. Maybe the OL object does not feel changed for Vue
            me.measureGeom = {
              geom: geom
            };
          });
        }, me);

        draw.on('drawend', () => {
          // unset sketch
          sketch = null;
          unByKey(listener);
        }, me);

        // make draw interaction available as member
        me.draw = draw;
      },
      /**
       * Removes the current interaction and clears the values.
       */
      removeInteraction () {
        var me = this;
        if (me.draw) {
          me.map.removeInteraction(me.draw);
        }
        if (me.source) {
          me.source.clear();
        }
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
