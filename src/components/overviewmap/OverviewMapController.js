import { OverviewMap } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

/**
 * Implementation of an OpenLayers based overview map.
 */
export default class OverviewMapController {
  overviewMapControl = null;
  map = null;
  layer = null;
  timerHandle = null

  /**
   * Construction
   * @param {ol.Map} map OpenLayers map.
   * @param {HTMLElement} target The target container to render the control.
   * @param {Object} config The overview map configuration object.
   */
  constructor (map, target, config) {
    this.map = map;
    this.conf = config || {};

    this.overviewMapControl = new OverviewMap({
      className: 'ol-overviewmap wgu-overviewmap-ctrl',
      target: target,
      collapsible: false,
      rotateWithView: this.conf.rotateWithView
    });

    this.setLayer(null);

    // TODO:
    // Workaround because without defering the following operation, OL will fail to render
    // the overview map control. Presumably because no sizes have been computed yet on the
    // target DOM element. Another deferred render operation within requestAnimationFrame is
    // necessary to correctly position the selection box.
    this.timerHandle = setTimeout(() => {
      this.map.addControl(this.overviewMapControl);
      this.setOlStyle();
      requestAnimationFrame(() => {
        this.overviewMapControl.render();
      });
    }, 100);
  };

  /**
   * Unregister the OpenLayers overview map.
   */
  destroy () {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
    if (this.layer) {
      const overviewMap = this.overviewMapControl.getOverviewMap();
      overviewMap.getLayers().clear();
    }
    if (this.map) {
      this.map.removeControl(this.overviewMapControl);
    }
    this.timerHandle = null;
    this.layer = null;
    this.map = null;
    this.overviewMapControl = null;
  }

  /**
   * Applies a vuetify card like style to the inner overview map.
   */
  setOlStyle () {
    document.querySelector('.ol-overviewmap-map').classList.add('v-card', 'ma-0');
  }

  /**
   * Set the layer to be displayed in the overview map.
   * Remarks:
   * As of OpenLayers 6 re-using the same layer instance between different map controls is no
   * longer supported. The workaround used here is to create a shallow clone if the layer is a
   * TileLayer by reusing the same source. This will cover most of the cases for background layers.
   * For other layer types fallback to an OSM layer.
   * @param {ol.layer.Base} layer The currently displayed layer.
   */
  setLayer (layer) {
    this.layer = (layer instanceof TileLayer)
      ? new TileLayer({
        extent: layer.getExtent(),
        source: layer.getSource()
      })
      : new TileLayer({
        source: new OSM()
      });

    const overviewMap = this.overviewMapControl.getOverviewMap();
    overviewMap.getLayers().clear();
    overviewMap.addLayer(this.layer);
  }
}
