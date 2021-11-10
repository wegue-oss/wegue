import { OverviewMap } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

/**
 * Implementation of an OpenLayers based overview map.
 */
export default class OverviewMapController {
  overviewMapControl = null;
  map = null;

  /**
   * Construction
   * @param {ol.Map} map OpenLayers map.
   * @param {Object} overviewMapConf The overview map configuration object.
   */
  constructor (map, overviewMapConf) {
    this.map = map;
    this.conf = overviewMapConf || {};

    this.overviewMapControl = new OverviewMap({
      className: 'ol-overviewmap wgu-overviewmap',
      collapsed: false
    });

    this.map.addControl(this.overviewMapControl);
    this.overviewMapControl.setRotateWithView(true);
  };

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
