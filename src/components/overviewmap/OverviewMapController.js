import { OverviewMap } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ColorUtil from '../../util/Color';

/**
 * Implementation of an OpenLayers based overview map.
 */
export default class OverviewMapController {
  overviewMapControl = null;
  map = null;
  layer = null;

  /**
   * Construction
   * @param {ol.Map} map OpenLayers map.
   * @param {Object} config The overview map configuration object.
   */
  constructor (map, config) {
    this.map = map;
    this.conf = config || {};

    this.overviewMapControl = new OverviewMap({
      className: 'ol-overviewmap wgu-overviewmap',
      collapsed: this.conf.collapsed,
      collapsible: this.conf.collapsible,
      label: this.conf.label,
      collapseLabel: this.conf.collapseLabel,
      rotateWithView: this.conf.rotateWithView
    });

    this.map.addControl(this.overviewMapControl);
    this.setOlStyle(this.conf.color);
  };

  /**
   * Unregister the OpenLayers overview map.
   */
  destroy () {
    if (this.layer) {
      const overviewMap = this.overviewMapControl.getOverviewMap();
      overviewMap.getLayers().clear();
    }
    if (this.map) {
      this.map.removeControl(this.overviewMapControl);
    }
    this.layer = null;
    this.map = null;
    this.overviewMapControl = null;
  }

  /**
   * Sets the background color of the OL expand button to the given color and applies a
   * vuetify card like style to the inner overview map .
   * @param {String} color The color to set.
   */
  setOlStyle (color) {
    document.querySelector('.ol-overviewmap-map').classList.add('v-card', 'ma-1');

    if (color) {
      if (ColorUtil.isCssColor(color)) {
        if (document.querySelector('.ol-overviewmap')) {
          document.querySelector('.ol-overviewmap button').style.backgroundColor = color;
          document.querySelector('.ol-overviewmap').style.borderColor = color;
        }
      } else {
        const [colorName, colorModifier] = color.toString().trim().split(' ', 2);
        if (document.querySelector('.ol-overviewmap')) {
          document.querySelector('.ol-overviewmap button').classList.add(colorName);
          document.querySelector('.ol-overviewmap button').classList.add(colorModifier);
        }
      }
    }
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
