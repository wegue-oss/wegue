import * as Extent from 'ol/extent';
import Vue from 'vue';

/**
 * A collection of pan and bounce animations to zoom an
 * OpenLayers view to a given location or extent.
 * Inspired by http://openlayers.org/en/latest/examples/animation.html
 */
const ViewAnimationUtil = {
  /**
   * Returns the animation object configured in the application context.
   * @returns The animation object.
   * @private
   */
  getAnimation () {
    const animations = {
      'pan': PanAnimation,
      'fly': FlyAnimation,
      'bounce': BounceAnimation,
      'default': PanAnimation
    };

    const appConfig = Vue.prototype.$appConfig;
    const animType = appConfig.viewAnimation?.type;
    return animations[animType] || animations['default'];
  },

  /**
   * Returns the configuration object for the animation. If options have been provided by the caller,
   * these options will be returned, otherwise return the options configured in the application
   * context.
   * @param {Object} options Optional configuration object for the animation.
   * @returns An object containing the animation configuration.
   * @private
   */
  getOptions (options) {
    const appConfig = Vue.prototype.$appConfig;
    return options || appConfig.viewAnimation?.options || {};
  },

  /**
   *
   * @param {ol.View} view The `ol.View` of the map.
   * @param {ol.Coordinate} location The destination center point to zoom to.
   * @param {function(complete)} completionCallback An optional notification that the animation has completed.
   * @param {Object} options Optional configuration object for the animation.
   */
  toLocation (view, location, completionCallback, options) {
    this.getAnimation().toLocation(view, location, completionCallback, this.getOptions(options));
  },

  /**
   *
   * @param {ol.View} view The `ol.View` of the map.
   * @param {ol.Extent} extent The destination extent to zoom to.
   * @param {function(complete)} completionCallback An optional notification that the animation has completed.
   * @param {Object} options Optional configuration object for the animation.
   */
  toExtent (view, extent, completionCallback, options) {
    this.getAnimation().toExtent(view, extent, completionCallback, this.getOptions(options));
  }
};

/**
 * A pan animation.
 * Remarks: This may also zoom in / zoom out, if a zoom level has been provided or the toExtent method
 *  is used.
 * @private
 */
const PanAnimation = {
  /**
   * Zoom to the given location by using a "pan" animation.
   * @param {ol.View} view The `ol.View` of the map.
   * @param {ol.Coordinate} location The destination center point to zoom to.
   * @param {function(complete)} completionCallback An optional notification that the animation has completed.
   * @param {Object} options Configuration object for the animation, supported attributes are:
   * * {Number} duration An optional animation duration.
   * * {Number} zoom An optional final zoom level.
   * * {Number} maxZoom An optional maximal zoom level.
   */
  toLocation (view, location, completionCallback, options) {
    // Set defaults if arguments are not provided.
    const duration = options.duration || 3000;
    const zoom = options.zoom || view.getZoom();
    const maxZoom = options.maxZoom || Infinity;

    // Pan / zoom to the location.
    function callback (complete) {
      if (completionCallback) {
        completionCallback(complete);
      }
    }

    view.animate({
      center: location,
      duration: duration,
      zoom: Math.min(zoom, maxZoom)
    }, callback);
  },

  /**
   * Zoom to fit the given extent by using a "pan" animation.
   * @param {ol.View} view The `ol.View` of the map.
   * @param {ol.Extent} extent The destination extent to zoom to.
   * @param {function(complete)} completionCallback An optional notification that the animation has completed.
   * @param {Object} options Configuration object for the animation, supported attributes are:
   * * {Number} duration An optional animation duration.
   * * {Number} maxZoom An optional maximal zoom level.
   */
  toExtent (view, extent, completionCallback, options) {
    // Set defaults if arguments are not provided.
    const duration = options.duration || 3000;
    const maxZoom = options.maxZoom || Infinity;

    // Then zoom to the given extent.
    const resolution = view.getResolutionForExtent(extent);
    const zoom = view.getZoomForResolution(resolution) - 0.2;

    const location = Extent.getCenter(extent);
    this.toLocation(view, location, completionCallback, {
      duration: duration,
      zoom: zoom,
      maxZoom: maxZoom
    });
  }
}

/**
 * A fly animation.
 * @private
 */
const FlyAnimation = {

  /**
   * Zoom to the given location by using a "fly" animation.
   * @param {ol.View} view The `ol.View` of the map.
   * @param {ol.Coordinate} location The destination center point to zoom to.
   * @param {function(complete)} completionCallback An optional notification that the animation has completed.
   * @param {Object} options Configuration object for the animation, supported attributes are:
   * * {Number} duration An optional animation duration.
   * * {Number} zoomOut An optional zoom out level.
   * * {Number} zoom An optional final zoom level.
   * * {Number} maxZoom An optional maximal zoom level.
   */
  toLocation (view, location, completionCallback, options) {
    // Set defaults if arguments are not provided.
    const duration = options.duration || 3000;
    const zoomOut = options.zoomOut || view.getZoom() - 1;
    const zoom = options.zoom || view.getZoom();
    const maxZoom = options.maxZoom || Infinity;

    // The animation consist of 2 simultaneous parts:
    // Zoom out then zoom in, while moving to the center location.
    var parts = 2;
    var finished = false;

    function callback (complete) {
      --parts;
      if (finished) {
        return;
      }
      if (parts === 0 || !complete) {
        finished = true;
        if (completionCallback) {
          completionCallback(complete);
        }
      }
    }

    view.animate({
      center: location,
      duration: duration
    }, callback);

    view.animate({
      zoom: zoomOut,
      duration: duration / 2
    }, {
      zoom: Math.min(zoom, maxZoom),
      duration: duration / 2
    }, callback);
  },

  /**
   * Zoom to fit the given extent by using a "fly" animation.
   * @param {ol.View} view The `ol.View` of the map.
   * @param {ol.Extent} extent The destination extent to zoom to.
   * @param {function(complete)} completionCallback An optional notification that the animation has completed.
   * @param {Object} options Configuration object for the animation, supported attributes are:
   * * {Number} duration An optional animation duration.
   * * {Number} maxZoom An optional maximal zoom level.
   */
  toExtent (view, extent, completionCallback, options) {
    // Set defaults if arguments are not provided.
    const duration = options.duration || 3000;
    const maxZoom = options.maxZoom || Infinity;

    // Zoom out to have both locations visible
    const extentOut = view.calculateExtent();
    Extent.extend(extentOut, extent);
    const resolutionOut = view.getResolutionForExtent(extentOut);
    const zoomOut = view.getZoomForResolution(resolutionOut) - 1;

    // Then zoom in to the given extent.
    const resolutionIn = view.getResolutionForExtent(extent);
    const zoom = view.getZoomForResolution(resolutionIn) - 0.2;

    const location = Extent.getCenter(extent);
    this.toLocation(view, location, completionCallback, {
      duration: duration,
      zoomOut: zoomOut,
      zoom: zoom,
      maxZoom: maxZoom
    });
  }
};

/**
 * A bounce animation.
 * @private
 */
const BounceAnimation =
{
  /**
   * An elastic easing method
   * (from https://github.com/DmitryBaranovskiy/raphael).
   * @private
   */
  elastic (t) {
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) *
              (2 * Math.PI) / 0.3) + 1;
  },

  /**
   * Zoom to the given location by using a "bounce" animation.
   * @param {ol.View} view The `ol.View` of the map.
   * @param {ol.Coordinate} location The destination center point to zoom to.
   * @param {function(complete)} completionCallback An optional notification that the animation has completed.
   * @param {Object} options Configuration object for the animation, supported attributes are:
   * * {Number} duration An optional animation duration.
   * * {Number} zoom An optional final zoom level.
   * * {Number} maxZoom An optional maximal zoom level.
   */
  toLocation (view, location, completionCallback, options) {
    // Set defaults if arguments are not provided.
    const duration = options.duration || 3000;
    const zoom = options.zoom || view.getZoom();
    const maxZoom = options.maxZoom || Infinity;

    // The animation consist of 2 simultaneous parts:
    // Zoom in or out, while moving to the center location.
    var parts = 2;
    var finished = false;

    function callback (complete) {
      --parts;
      if (finished) {
        return;
      }
      if (parts === 0 || !complete) {
        finished = true;
        if (completionCallback) {
          completionCallback(complete);
        }
      }
    }

    view.animate({
      center: location,
      duration: duration,
      easing: this.elastic
    }, callback);

    view.animate({
      zoom: Math.min(zoom, maxZoom),
      duration: duration
    }, callback);
  },

  /**
   * Zoom to fit the given extent by using a "bounce" animation.
   * @param {ol.View} view The `ol.View` of the map.
   * @param {ol.Extent} extent The destination extent to zoom to.
   * @param {function(complete)} completionCallback An optional notification that the animation has completed.
   * @param {Object} options Configuration object for the animation, supported attributes are:
   * * {Number} duration An optional animation duration.
   * * {Number} maxZoom An optional maximal zoom level.
   */
  toExtent (view, extent, completionCallback, options) {
    // Set defaults if arguments are not provided.
    const duration = options.duration || 3000;
    const maxZoom = options.maxZoom || Infinity;

    // Then zoom to the given extent.
    const resolution = view.getResolutionForExtent(extent);
    const zoom = view.getZoomForResolution(resolution) - 0.2;

    const location = Extent.getCenter(extent);
    this.toLocation(view, location, completionCallback, {
      duration: duration,
      zoom: zoom,
      maxZoom: maxZoom
    });
  }
};

export default ViewAnimationUtil;
