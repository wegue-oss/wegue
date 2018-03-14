import TileLayer from 'ol/layer/tile'
import TileWmsSource from 'ol/source/tilewms'
import OsmSource from 'ol/source/osm'
import VectorTileLayer from 'ol/layer/vectortile'
import VectorTileSource from 'ol/source/vectortile'
import MvtFormat from 'ol/format/mvt'
import GeoJsonFormat from 'ol/format/geojson'
import TopoJsonFormat from 'ol/format/topojson'
import KmlFormat from 'ol/format/kml'
import VectorLayer from 'ol/layer/vector'
import VectorSource from 'ol/source/vector'

/**
 * Factory, which creates OpenLayers layer instances according to a given config
 * object.
 */
export const LayerFactory = {

  /**
   * Maps the format literal of the config to the corresponding OL module.
   * @type {Object}
   */
  formatMapping: {
    'MVT': MvtFormat,
    'GeoJSON': GeoJsonFormat,
    'TopoJSON': TopoJsonFormat,
    'KML': KmlFormat
  },

  /**
   * Returns an OpenLayers layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Base} OL layer instance
   */
  getInstance (lConf) {
    // apply LID (Layer ID) if not existant
    if (!lConf.lid) {
      var now = new Date();
      lConf.lid = now.getTime();
    }

    // create correct layer type
    if (lConf.type === 'WMS') {
      return this.createWmsLayer(lConf);
    } else if (lConf.type === 'OSM') {
      return this.createOsmLayer(lConf);
    } else if (lConf.type === 'VECTOR') {
      return this.createVectorLayer(lConf);
    } else if (lConf.type === 'VECTORTILE') {
      return this.createVectorTileLayer(lConf);
    } else {
      return null;
    }
  },

  /**
   * Returns an OpenLayers WMS layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Tile} OL WMS layer instance
   */
  createWmsLayer (lConf) {
    const layer = new TileLayer({
      name: lConf.name,
      lid: lConf.lid,
      extent: lConf.extent,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: new TileWmsSource({
        url: lConf.url,
        params: {
          'LAYERS': lConf.layers,
          'TILED': lConf.tiled
        },
        serverType: lConf.serverType,
        attributions: lConf.attributions
      })
    });

    return layer;
  },

  /**
   * Returns an OpenLayers OSM layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Tile} OL OSM layer instance
   */
  createOsmLayer (lConf) {
    const layer = new TileLayer({
      name: lConf.name,
      lid: lConf.lid,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: new OsmSource()
    });

    return layer;
  },

  /**
   * Returns an OpenLayers vector layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Vector} OL vector layer instance
   */
  createVectorLayer (lConf) {
    var vectorLayer = new VectorLayer({
      name: lConf.name,
      lid: lConf.lid,
      extent: lConf.extent,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: new VectorSource({
        url: lConf.url,
        format: new this.formatMapping[lConf.format](lConf.formatConfig),
        attributions: lConf.attributions
      })
    });

    return vectorLayer;
  },

  /**
   * Returns an OpenLayers vector tile layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.VectorTile} OL vector tile layer instance
   */
  createVectorTileLayer (lConf) {
    const vtLayer = new VectorTileLayer({
      name: lConf.name,
      lid: lConf.lid,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: new VectorTileSource({
        url: lConf.url,
        format: new this.formatMapping[lConf.format](),
        attributions: lConf.attributions
      })
    });

    return vtLayer;
  }

}
