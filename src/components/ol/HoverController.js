import Vue from 'vue'
import HoverTooltip from './HoverTooltip'
import Overlay from 'ol/Overlay';
import TileWmsSource from 'ol/source/TileWMS';
import ImageWMSSource from 'ol/source/ImageWMS';
import VectorSource from 'ol/source/Vector';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';
import axios from 'axios';

export default class HoverController {
  map = null;

  /**
   * Initializes the map hover functionality:
   * Adds a little tooltip like DOM element, wrapped as OL Overlay to the
   * map.
   * Registers a 'pointermove' event on the map and shows the layer's
   * 'hoverAttribute' if the layer is configured as 'hoverable'
   */
  constructor (map) {
    const me = this;
    me.map = map;
    // TODO review why closure for this scope is required
    // map.on('pointermove', me.onPointerMove, me);
    map.on('pointermove', (event) => me.onPointerMove(event));
  }

  /**
   * Shows the hover tooltip on the map if an appropriate feature of a
   * 'hoverable' layer was hit with the mouse.
   *
   * @param  {Object} event The OL event for pointermove
   */
  onPointerMove (event) {
    const me = this;
    const map = me.map;
    const pixel = event.pixel;
    let hoverAttr;

    map.forEachLayerAtPixel(pixel, (layer, pixelValues) => {
      if (!layer.get('hoverable')) {
        return;
      }
      var source = layer.getSource();
      if (source instanceof TileWmsSource || source instanceof ImageWMSSource) {
        me.getWMSFeaturesAsync(map, layer, event.coordinate)
          .then(function (features) {
            hoverAttr = layer.get('hoverAttribute');
            me.displayTooltip(features, hoverAttr, event.coordinate)
          })
          .catch(function (error) {
            console.error(error);
          })
      } else if (source instanceof VectorSource) {
        hoverAttr = layer.get('hoverAttribute');
        const features = me.getVectorFeatures(map, layer, pixel);
        me.displayTooltip(features, hoverAttr, event.coordinate)
      }
    });
  }

  /**
   *
   * @param {*} map
   * @param {*} layer
   * @param {*} pixel
   * @returns
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
   *
   * @param {*} map
   * @param {*} layer
   * @param {*} coordinate
   * @returns
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

  displayTooltip (features, hoverAttr, coordinate) {
    const me = this;

    if (me.overlay) {
      me.map.removeOverlay(me.overlay);
      me.overlay = null;
    }

    if (!features || features.length === 0 || !hoverAttr) {
      return;
    }
    const feature = features[0];

    var HoverTooltipCtor = Vue.extend(HoverTooltip);
    var hoverTooltip = new HoverTooltipCtor({
      propsData: {
        feature: feature,
        hoverAttribute: hoverAttr
      }
    });
    hoverTooltip.$mount();

    // wrap the tooltip span in a OL overlay and add it to map
    me.overlay = new Overlay({
      element: hoverTooltip.$el,
      stopEvent: false,
      position: coordinate,
      // className: 'wgu-hover-ol-overlay',
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    me.map.addOverlay(me.overlay);
  }
}
