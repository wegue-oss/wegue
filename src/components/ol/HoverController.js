import TileWmsSource from 'ol/source/TileWMS';
import ImageWMSSource from 'ol/source/ImageWMS';
import VectorSource from 'ol/source/Vector';
import VectorTileSource from 'ol/source/VectorTile';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';
import { WguEventBus } from '@/WguEventBus';
import ObjectUtil from '@/util/Object';
import axios from 'axios';

export default class HoverController {
  DEFAULT_OPTIONS = {
    delay: 150,
    hideOnMousemove: false,
    hoverOverlay: 'wgu-hover-tooltip'
  };

  map = null;
  conf = null;
  timerHandle = null;
  activeOverlayId = null;
  pendingRequestsAbortCtrl = null;

  /**
   * Initializes the map hover functionality:
   * Adds a little tooltip like DOM element, wrapped as OL Overlay to the
   * map.
   * Registers a 'pointermove' event on the map and shows the layer's
   * 'hoverAttribute' if the layer is configured as 'hoverable'
   *
   * @param {ol.Map} map OpenLayers map.
   * @param {object} [hoverConf] Optional global configuration options.
   */
  constructor (map, hoverConf) {
    const me = this;
    me.map = map;
    me.conf = me.DEFAULT_OPTIONS;
    ObjectUtil.mergeDeep(me.conf, hoverConf);

    // To limit the amount of asynchronous requests, implement a "pointer rest" behavior,
    // which will potentially show a tooltip after the mouse has not moved for a given time period.
    map.on('pointermove', (event) => {
      if (me.timerHandle) {
        clearTimeout(me.timerHandle);
      }
      me.timerHandle = setTimeout(() => {
        me.onPointerRest(event);
      }, me.conf.delay);
      if (me.conf.hideOnMousemove) {
        me.displayTooltip(null);
      }
    });

    // If the mouse leaves the map canvas, clear out the "pointer rest" timer and hide
    // the existing tooltip.
    map.getViewport().addEventListener('mouseout', (event) => {
      if (me.timerHandle) {
        clearTimeout(me.timerHandle);
      }
      me.displayTooltip(null);
    }, false);
  }

  /**
   * Tears down this controller.
   */
  destroy () {
    const me = this;

    if (me.timerHandle) {
      clearTimeout(me.timerHandle);
      me.timerHandle = null;
    }

    if (me.pendingRequestsAbortCtrl) {
      me.pendingRequestsAbortCtrl.abort();
      me.pendingRequestsAbortCtrl = null;
    }

    if (me.activeOverlayId) {
      WguEventBus.$emit(me.activeOverlayId + '-update-overlay', false);
      me.activeOverlayId = null;
    }

    me.map = null;
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
    const abortController = new AbortController();

    // Cancel pending requests and create a new cancel token source which corresponds
    // to all async requests sent in this iteration.
    if (me.pendingRequestsAbortCtrl) {
      me.pendingRequestsAbortCtrl.abort();
    }
    me.pendingRequestsAbortCtrl = abortController;

    // Sort the layers by z-order.
    // If z-index is equal, later layer in collection appears topmost.
    const layers = map.getLayers().getArray()
      .map((layer, index) => ({ layer, index }))
      .filter(({ layer }) =>
        layer.get('hoverable') && layer.isVisible()
      )
      .sort((a, b) => {
        const zA = a.layer.getZIndex() ?? 0;
        const zB = b.layer.getZIndex() ?? 0;

        if (zA !== zB) {
          return zB - zA;
        }
        return b.index - a.index;
      });

    // Obtain features for all layers.
    const requests = layers.map(({ layer }) => {
      const source = layer.getSource();

      if (source instanceof TileWmsSource || source instanceof ImageWMSSource) {
        return me.getWMSFeaturesAsync(map, layer, coordinate, abortController)
          .then(features => features.map(
            feature => ({ layer, feature })
          ))
          .catch(error => {
            if (!axios.isCancel(error)) {
              console.error(error.message);
            }
            throw error;
          });
      }

      if (source instanceof VectorSource || source instanceof VectorTileSource) {
        const features = me.getVectorFeatures(map, layer, pixel);
        return Promise.resolve(
          features.map(feature => ({ layer, feature }))
        );
      }

      return Promise.resolve([]);
    });

    // Remarks:
    // Promise.allSettled preserves the z-order of the requests array,
    // regardless of which request finishes first.
    // Ignore results from an outdated request cycle.
    Promise.allSettled(requests).then(results => {
      if (me.pendingRequestsAbortCtrl !== abortController) {
        return;
      }

      const result = results.find(
        result => result.status === 'fulfilled' &&
          result.value.length > 0
      );

      if (result) {
        me.displayTooltip(result.value, coordinate);
      } else {
        me.displayTooltip(null);
      }
    })
  }

  /**
   * Get the features of a vector layer at the current pixel.
   * @param {ol.Map} map OpenLayers map.
   * @param {ol.layer.Vector | ol/layer/VectorTile} layer The layer to acquire the features for.
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
   * @param {ol.layer.Tile | ol.layer.Image} layer The layer to acquire the features for.
   * @param {ol.Coordinate} coordinate The coordinate in map projection.
   * @param {AbortController} [abortCtrl] An optional abort controller to abort the request.
   * @returns {Promise<Array<ol.Feature>>}
   */
  getWMSFeaturesAsync (map, layer, coordinate, abortCtrl) {
    const view = map.getView();
    return new Promise((resolve, reject) => {
      const url = layer.getSource().getFeatureInfoUrl(
        coordinate,
        view.getResolution(),
        view.getProjection(),
        {
          INFO_FORMAT: 'application/vnd.ogc.gml/3.1.1'
        }
      );
      if (!url) {
        reject(new Error('URL is undefined'));
      }

      const request = {
        method: 'GET',
        url,
        signal: abortCtrl?.signal
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
    const overlayId = layer.get('hoverOverlay') || me.conf.hoverOverlay;

    if (me.activeOverlayId !== overlayId) {
      WguEventBus.$emit(me.activeOverlayId + '-update-overlay', false);
    };
    WguEventBus.$emit(overlayId + '-update-overlay', true, coordinate, {
      feature,
      layer,
      hoverAttribute: hoverAttr
    });
    me.activeOverlayId = overlayId;
  }
};
