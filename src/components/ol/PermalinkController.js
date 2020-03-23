import Projection from 'ol/proj/Projection';
import {transform} from 'ol/proj';
import UrlUtil from '../../util/Url';

/**
 * Class holding the logic for permalinks.
 */
export default class PermalinkController {
  /* the OL map for permalink */
  map = null;
  shouldUpdate = false;
  projection = null;
  conf = null;
  urlParams = null;

  constructor (map, permalinkConf) {
    this.map = map;
    this.conf = permalinkConf || {};
    this.projection = this.conf.projection ? new Projection({'code': this.conf.projection}) : null;
    this.conf.paramPrefix = this.conf.paramPrefix || '';
    this.conf.location = this.conf.location || 'hash';
    this.conf.separator = this.conf.location === 'hash' ? '#' : '?';
    this.urlParams = UrlUtil.getParams(this.conf.location);
  }

  /**
   * Initializes the map permalink functionality:
   * Registers a 'moveend' event to update the permalink
   * 'hoverAttribute' if the layer is configured as 'hoverable'
   */
  setup () {
    this.shouldUpdate = true;

    // Listen to map state changes (pan, zoom)
    this.map.on('moveend', () => {
      this.onMapChange();
    });

    if (this.conf.history === false) {
      return;
    }
    // restore the view state when navigating through the history, see
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
    window.addEventListener('popstate', (event) => {
      if (event.state === null) {
        return;
      }
      const view = this.map.getView();
      let center = event.state.center;
      if (this.projection) {
        center = transform(center, this.projection, view.getProjection());
      }

      this.shouldUpdate = false;
      view.setCenter(center);
      view.setZoom(event.state.zoom);
      view.setRotation(event.state.rotation);
    });
  }

  apply () {
    const permalinkParams = UrlUtil.getParams(this.conf.location);
    const prefix = this.conf.paramPrefix;

    // try to modify center, zoom-level and rotation from permalink params in URL
    const mapView = this.map.getView();

    // Permalink coordinates may have specific Projection like WGS84
    if (permalinkParams[`${prefix}c`]) {
      let centerMod = permalinkParams[`${prefix}c`].split(',').map((n) => {
        return parseFloat(n);
      });

      if (this.projection) {
        centerMod = transform(centerMod, this.projection, mapView.getProjection())
      }

      mapView.setCenter(centerMod);
    }

    if (permalinkParams[`${prefix}z`]) {
      mapView.setZoom(parseInt(permalinkParams[`${prefix}z`]));
    }

    if (permalinkParams[`${prefix}r`]) {
      mapView.setRotation(parseFloat(permalinkParams[`${prefix}r`]));
    }
  }

  getParamStr () {
    const round = (num, places) => {
      return +(Math.round(num + 'e+' + places) + 'e-' + places);
    };

    const state = this.getState();
    const prefix = this.conf.paramPrefix || '';

    this.urlParams[`${prefix}z`] = `${round(state.zoom, 4)}`;
    this.urlParams[`${prefix}c`] = `${round(state.center[0], 4)},${round(state.center[1], 4)}`;
    this.urlParams[`${prefix}r`] = `${round(state.rotation, 4)}`;

    return this.conf.separator + UrlUtil.toQueryString(this.urlParams);
  }

  getState () {
    const mapView = this.map.getView();
    let center = mapView.getCenter();
    if (this.projection) {
      center = transform(center, mapView.getProjection(), this.projection);
    }
    return {
      zoom: mapView.getZoom(),
      center: center,
      rotation: mapView.getRotation()
    };
  }

  onMapChange () {
    if (!this.shouldUpdate) {
      // do not update the URL when the view was changed in the 'popstate' handler
      this.shouldUpdate = true;
      return;
    }
    if (this.conf.history === true) {
      window.history.pushState(this.getState(), 'map', this.getParamStr());
    }
  }
}
