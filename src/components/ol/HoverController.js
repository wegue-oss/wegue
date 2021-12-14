import TileWmsSource from 'ol/source/TileWMS';
import ImageWMSSource from 'ol/source/ImageWMS';
import VectorSource from 'ol/source/Vector';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';
import { WguEventBus } from '../../WguEventBus'
import axios from 'axios';

export default class HoverController {
  map = null;
  timerHandle = null;
  activeOverlayId = null;

  /**
   * Initializes the map hover functionality:
   * Adds a little tooltip like DOM element, wrapped as OL Overlay to the
   * map.
   * Registers a 'pointermove' event on the map and shows the layer's
   * 'hoverAttribute' if the layer is configured as 'hoverable'
   *
   * @param {ol.Map} map OpenLayers map.
   * @param {Number} pointerRestInterval Timespan in milliseconds, by which displaying the tooltip is deferred.
   */
  constructor (map, pointerRestInterval) {
    const me = this;
    me.map = map;

    // To limit the amount of asynchronous requests, implement a "pointer rest" behavior,
    // which will potentially show a tooltip after the mouse has not moved for a given time period.
    const timeout = pointerRestInterval ?? 150;
    map.on('pointermove', (event) => {
      if (me.timerHandle) {
        clearTimeout(me.timerHandle);
      }
      me.timerHandle = setTimeout(() => {
        me.onPointerRest(event);
      }, timeout);
    });
  }

  /**
   * Shows the hover tooltip on the map if an appropriate feature of a
   * 'hoverable' layer was hit with the mouse. In the case of overlapping features,
   * only the first detected feature is displayed.
   * @param  {Object} event The OL event for pointermove
   */
  onPointerRest (event) {
    const me = this;
    const map = me.map;
    const pixel = event.pixel;
    const coordinate = event.coordinate;
    var featureInfos = [];

    map.forEachLayerAtPixel(pixel, (layer) => {
      if (!layer.get('hoverable')) {
        return;
      }
      var source = layer.getSource();
      if (source instanceof TileWmsSource || source instanceof ImageWMSSource) {
        me.getWMSFeaturesAsync(map, layer, coordinate)
          .then(function (features) {
            featureInfos.push(...features.map((feat) => {
              return { layer: layer, feature: feat };
            }));
            me.displayTooltip(featureInfos, coordinate)
          })
          .catch(function (error) {
            console.error(error);
          })
      } else if (source instanceof VectorSource) {
        const features = me.getVectorFeatures(map, layer, pixel);
        featureInfos.push(...features.map((feat) => {
          return { layer: layer, feature: feat };
        }));
        me.displayTooltip(featureInfos, coordinate)
      }
    });
  }

  /**
   * Get the features of a vector layer at the current pixel.
   * @param {ol.Map} map OpenLayers map.
   * @param {ol.layer.Vector} layer The layer to acquire the features for.
   * @param {ol.pixel} pixel The pixel on the viewport.
   * @returns {Array<ol.Feature>}
   */
  getVectorFeatures (map, layer, pixel) {
    const features = map.getFeaturesAtPixel(pixel, {
      layerFilter: (layerCand) => {
        return layerCand === layer;
      }
    });
    return features;
  }

  /**
   * Get the features of a vector layer at the current pixel.
   * @param {ol.Map} map OpenLayers map.
   * @param {ol.layer.Base} layer The layer to acquire the features for.
   * @param {ol.Coordinate} coordinate The coordinate in map projection.
   * @returns {Promise<Array<ol.Feature>>}
   */
  getWMSFeaturesAsync (map, layer, coordinate) {
    const view = map.getView();
    return new Promise((resolve, reject) => {
      const url = layer.getSource().getFeatureInfoUrl(
        coordinate,
        view.getResolution(),
        view.getProjection(),
        {
          'INFO_FORMAT': 'application/vnd.ogc.gml/3.1.1'
        }
      );
      if (!url) {
        reject(new Error('URL is undefined'));
      }

      const request = {
        method: 'GET',
        url: url
      };
      axios(request)
        .then(response => {
          const features = new WMSGetFeatureInfo().readFeatures(response.data);
          resolve(features);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * Displays a tooltip for the first feature among featureInfos.
   * If no feature is present, hide the active hover tooltip.
   * @param {Array} featureInfos List of features with their respective layers.
   * @param {*} coordinate Coordinate in map projection of the mouse cursor.
   */
  displayTooltip (featureInfos, coordinate) {
    const me = this;

    if (!featureInfos || featureInfos.length === 0) {
      if (me.activeOverlayId) {
        WguEventBus.$emit(me.activeOverlayId + '-update-overlay', false);
        me.activeOverlayId = null;
      }
      return;
    }

    const featureInfo = featureInfos[0];
    const feature = featureInfo.feature;
    const layer = featureInfo.layer;
    const hoverAttr = layer.get('hoverAttribute');
    const overlayId = layer.get('hoverOverlay') || 'wgu-hover-tooltip';

    if (me.activeOverlayId !== overlayId) {
      WguEventBus.$emit(me.activeOverlayId + '-update-overlay', false);
    };
    WguEventBus.$emit(overlayId + '-update-overlay', true, coordinate, {
      feature: feature,
      hoverAttribute: hoverAttr
    });
    me.activeOverlayId = overlayId;
  }
}
