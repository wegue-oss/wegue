import Projection from 'ol/proj/Projection';
import {getTransform, transform} from 'ol/proj';
import UrlUtil from '../../util/Url';
import {applyTransform} from 'ol/extent';

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
    this.conf.history = this.conf.history ? this.conf.history : false;
    this.conf.extent = this.conf.extent ? this.conf.extent : false;
    this.conf.layers = this.conf.layers ? this.conf.layers : false;
    this.conf.precision = this.conf.precision ? this.conf.precision : 4;
    this.urlParams = UrlUtil.getParams(this.conf.location);
    this.layerListeners = [];
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

    // Listen to visibility changes in Map Layers.
    this.subscribeLayers();

    // Listen to Layer Collection (dynamically Layers added/removed)
    this.map.getLayers().on('change:length', () => {
      this.subscribeLayers();
    });

    if (this.conf.history === false) {
      return;
    }

    // restore the view state when navigating through the history (browser back/forward buttons), see
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
    window.addEventListener('popstate', (event) => {
      if (event.state === null) {
        return;
      }

      const view = this.map.getView();
      const state = event.state;

      this.shouldUpdate = false;

      view.setRotation(state.rotation);

      // Use extent (bbox) or center+zoom based on config
      if (this.conf.extent) {
        this.applyExtent(state.extent);
      } else {
        this.applyCenter(state.center);
      }

      // somehow we also need zoom (or resolution) for extent:
      // See: https://stackoverflow.com/questions/47770782/openlayers-fit-to-current-extent-is-zooming-out
      view.setZoom(state.zoom);

      if (this.conf.layers) {
        this.applyLayers(new Map(state.layers.map(lid => [lid, lid])));
      }
    });
  }

  /**
   * Subscribe to Layer visibility changes.
   */
  subscribeLayers () {
    // First unsubscribe from all
    this.unsubscribeLayers();

    // Listen to each Layer's visibility changes.
    this.map.getLayers().forEach((layer) => {
      const key = layer.on('change:visible', () => {
        this.onMapChange();
      });
      this.layerListeners.push({'key': key, 'layer': layer});
    });
  }

  /**
   * Unsubscribe to Layer visibility changes.
   */
  unsubscribeLayers () {
    // Listen to each Layer's visibility changes.
    this.layerListeners.forEach((item) => {
      item.layer.un(item.key.type, item.key.listener)
    });
    this.layerListeners = [];
  }

  /**
   * Applies map (View) rotation, center+zoom-level or extent
   * from permalink params in current URL 'location'
   */
  apply () {
    const permalinkParams = UrlUtil.getParams(this.conf.location);
    const prefix = this.conf.paramPrefix;
    const mapView = this.map.getView();
    const r = `${prefix}r`;
    const c = `${prefix}c`;
    const e = `${prefix}e`;
    const z = `${prefix}z`;
    const l = `${prefix}l`;

    if (permalinkParams[r]) {
      mapView.setRotation(parseFloat(permalinkParams[r]));
    }

    // Both extent (bbox) or center+zoom supported.
    if (permalinkParams[e]) {
      let extent = permalinkParams[e].split(',').map((n) => {
        return parseFloat(n);
      });
      this.applyExtent(extent);
    } else if (permalinkParams[c]) {
      let center = permalinkParams[c].split(',').map((n) => {
        return parseFloat(n);
      });
      this.applyCenter(center);
    }

    // Always set zoom, even with extent
    // See: https://stackoverflow.com/questions/47770782/openlayers-fit-to-current-extent-is-zooming-out
    if (permalinkParams[z]) {
      mapView.setZoom(parseFloat(permalinkParams[z]));
    }

    // Set layer(s) visible
    if (permalinkParams[l]) {
      this.applyLayers(new Map(permalinkParams[l].split(',').map(lid => [lid, lid])));
    }
  }

  /**
   * Make only the layers for given array of layer ids visible.
   */
  applyLayers (layers) {
    if (!layers) {
      return;
    }
    this.map.getLayers().forEach((layer) => {
      const layerId = layer.get('lid');
      layer.setVisible(layerId === layers.get(layerId));
    })
  }

  /**
   * Position map at provided center.
   */
  applyCenter (center) {
    if (!center) {
      return;
    }
    const mapView = this.map.getView();

    // Permalink coordinates may have specific Projection like WGS84
    if (this.projection) {
      center = transform(center, this.projection, mapView.getProjection())
    }

    mapView.setCenter(center);
  }

  /**
   * Position map at provided map extent.
   */
  applyExtent (extent) {
    if (!extent) {
      return;
    }
    const mapView = this.map.getView();
    // Permalink coordinates may have specific Projection like WGS84
    if (this.projection) {
      extent = applyTransform(extent, getTransform(this.projection, mapView.getProjection()))
    }

    // Fit the map in extent
    mapView.fit(extent, this.map.getSize());
  }

  /**
   * Get the URL parameter permalink string as query or hash.
   */
  getParamStr () {
    const round = (num, places) => {
      return +(Math.round(num + 'e+' + places) + 'e-' + places);
    };

    const state = this.getState();
    const prefix = this.conf.paramPrefix;
    const prec = this.conf.precision;

    // Use extent (bbox) or center+zoom based on config
    this.urlParams[`${prefix}z`] = `${round(state.zoom, prec)}`;
    if (this.conf.extent) {
      this.urlParams[`${prefix}e`] = state.extent.map(n => round(n, prec)).join(',');
    } else {
      this.urlParams[`${prefix}c`] = state.center.map(n => round(n, prec)).join(',');
    }
    this.urlParams[`${prefix}r`] = `${round(state.rotation, prec)}`;

    if (this.conf.layers) {
      this.urlParams[`${prefix}l`] = state.layers.join(',');
    }

    return this.conf.separator + UrlUtil.toQueryString(this.urlParams);
  }

  /**
   * Get full URL with permalink string for sharing.
   */
  getShareUrl () {
    return location.href.split(this.conf.separator)[0] + this.getParamStr();
  }

  /**
   * Get (IFrame) code fragment for embedding the permalink in an HTML page.
   */
  getEmbedHTML () {
    const mapSize = this.map.getSize();

    return `<iframe width="${mapSize[0]}" height="${mapSize[1]}" src="${this.getShareUrl()}" style="border:none;"></iframe>`;
  }

  /**
   * Get array of visible layer id's.
   */
  getLayerIds () {
    return this.map.getLayers().getArray().filter(layer => !!layer.get('lid') && layer.getVisible()).map(layer => layer.get('lid'));
  }

  /**
   * Get total State of the Map.
   */
  getState () {
    const mapView = this.map.getView();
    let center = mapView.getCenter();
    let extent = mapView.calculateExtent();

    // Optionally reproject to permalink projection (e.g. WGS84 on WebMerc).
    if (this.projection) {
      center = transform(center, mapView.getProjection(), this.projection);
      extent = applyTransform(extent, getTransform(mapView.getProjection(), this.projection));
    }
    return {
      zoom: mapView.getZoom(),
      center: center,
      extent: extent,
      rotation: mapView.getRotation(),
      layers: this.getLayerIds()
    };
  }

  /**
   * Callback when Map View has changed, e.g. 'moveend' or a Layer's visibility.
   */
  onMapChange () {
    // console.log('mapchange');
    if (!this.shouldUpdate) {
      // do not update the URL when the view was changed in the 'popstate' handler
      this.shouldUpdate = true;
      return;
    }
    if (this.conf.history === false) {
      return;
    }
    // This changes the URL in address bar.
    window.history.pushState(this.getState(), 'map', this.getParamStr());
  }
}
