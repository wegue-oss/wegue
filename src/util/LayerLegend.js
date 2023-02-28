/**
 * Implements URL parametrization to obtain legend images for layers.
 */

import TileWmsSource from 'ol/source/TileWMS';
import ImageWmsSource from 'ol/source/ImageWMS';
import Vue from 'vue';

const CustomLegend = {
  /**
   * Returns a URL to the legend image.
   * This replaces the parameter placeholders in formatUrl.
   * @param {ol.Source} source The source to produce the legend for.
   * @param {Number} resolution Resolution of the legend image.
   * @param {Object} options Optional configuration params.
   * @param {String} formatUrl  A custom format URL.
   * @returns {String} The legend URL.
   */
  getUrl (source, resolution, options, formatUrl) {
    let url = formatUrl;
    const placeholders = options || {};

    // Remarks: Resolution to scale conversion taken from OL - TileWMS.js.
    if (resolution !== undefined) {
      const mpu = source.getProjection()
        ? source.getProjection().getMetersPerUnit()
        : 1;
      const pixelSize = 0.00028;
      placeholders.SCALE = (resolution * mpu) / pixelSize;
    }

    for (const key in placeholders) {
      const regex = new RegExp('{{' + key + '}}', 'gi');
      url = url.replace(regex, placeholders[key]);
    }
    return url;
  }
}

const WMSSourceLegend = {
  /**
   * Returns a URL to the legend image.
   * @param {ol.Source} source The source to produce the legend for.
   * @param {Number} resolution Resolution of the legend image.
   * @param {Object} options Optional configuration params.
   * @returns {String} The legend URL.
   */
  getUrl (source, resolution, options) {
    return source.getLegendUrl(resolution, options);
  }
}

const LayerLegend = {
  /**
   * Merges the given legend options with the legend options configured
   * in the application context. The provided options will take precedence.
   * @param {Object} options Optional configuration params.
   * @returns {Object} Merged configuration params.
   */
  getOptions (options) {
    const appConfig = Vue.prototype.$appConfig;
    return {
      ...appConfig?.legend,
      ...options
    };
  },

  /**
   * Returns a URL to the layers legend image.
   * @param {ol.Layer} layer The layer to produce the legend for.
   * @param {Number} resolution Resolution of the legend image.
   * @param {Object} options Optional configuration params.
   * @param {String} formatUrl A custom format URL.
   * @returns {String} Legend URL or undefined if no legend can be produced.
   */
  getUrl (layer, resolution, options, formatUrl) {
    const opts = this.getOptions(options);
    const source = layer.getSource();

    // If we cannot obtain a source, no legend can be produced.
    if (!source) {
      return undefined;
    }

    // If a formatUrl is provided, the legend is custom.
    if (formatUrl) {
      return CustomLegend.getUrl(source, resolution, opts, formatUrl);
    }

    // For WMS based sources, use the in-built legend URL formatter.
    if (
      source instanceof TileWmsSource ||
      source instanceof ImageWmsSource
    ) {
      return WMSSourceLegend.getUrl(source, resolution, opts);
    }

    return undefined;
  }
}

export default LayerLegend;
