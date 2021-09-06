
import DrawInteraction from 'ol/interaction/Draw';
import { unByKey } from 'ol/Observable.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';

/**
 * Class holding the OpenLayers related logic for the measure tool.
 */
export default class OlMeasureController {
  /* the OL map we want to measure on */
  map = null;

  constructor (olMap, measureConf) {
    this.map = olMap;
    this.measureConf = measureConf || {};
    this.measureLayer = undefined;
  }

  /**
   * Tears down this controller.
   */
  destroy () {
    if (!this.measureLayer || !this.map) {
      return;
    }
    this.removeInteraction();
    this.map.removeLayer(this.measureLayer);
    this.measureLayer = undefined;
  }

  /**
   * Creates a vector layer for the measurement results and adds it to the
   * map.
   */
  createMeasureLayer () {
    const me = this;
    const measureConf = me.measureConf;
    // create a vector layer to
    var source = new VectorSource();
    this.measureLayer = new VectorLayer({
      lid: 'wgu-measure-layer',
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

    me.map.addLayer(this.measureLayer);

    // make vector source available as member
    me.source = source;
  }

  /**
   * Creates and adds the necessary draw interaction and adds it to the map.
   */
  addInteraction (measureType, mapClickCb) {
    const me = this;
    const measureConf = me.measureConf;
    // cleanup possible old draw interaction
    if (me.draw) {
      me.removeInteraction();
    }

    var type = (measureType === 'area' ? 'Polygon' : 'LineString');
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
        // execute given callback
        mapClickCb(geom);
      });
    }, me);

    draw.on('drawend', () => {
      // unset sketch
      sketch = null;
      unByKey(listener);
    }, me);

    // make draw interaction available as member
    me.draw = draw;
  }

  /**
   * Removes the current interaction and clears the values.
   */
  removeInteraction () {
    if (this.draw) {
      this.map.removeInteraction(this.draw);
      this.draw = undefined;
    }
    if (this.source) {
      this.source.clear();
    }
  }
}
