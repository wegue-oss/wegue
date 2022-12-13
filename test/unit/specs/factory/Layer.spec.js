import { LayerFactory } from '@/factory/Layer'
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import TileWmsSource from 'ol/source/TileWMS';
import OsmSource from 'ol/source/OSM';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XyzSource from 'ol/source/XYZ';
import MvtFormat from 'ol/format/MVT'
import GeoJsonFormat from 'ol/format/GeoJSON'
import TopoJsonFormat from 'ol/format/TopoJSON'
import KmlFormat from 'ol/format/KML'
import Map from 'ol/Map';
import View from 'ol/View';

describe('LayerFactory', () => {
  it('is defined', () => {
    expect(typeof LayerFactory).to.not.equal(undefined);
  });

  it('has the correct functions', () => {
    expect(typeof LayerFactory.getInstance).to.equal('function');
    expect(typeof LayerFactory.createTileWmsLayer).to.equal('function');
    expect(typeof LayerFactory.createImageWmsLayer).to.equal('function');
    expect(typeof LayerFactory.createXyzLayer).to.equal('function');
    expect(typeof LayerFactory.createOsmLayer).to.equal('function');
    expect(typeof LayerFactory.createVectorLayer).to.equal('function');
    expect(typeof LayerFactory.createVectorTileLayer).to.equal('function');
  });

  it('getInstance returns correct instance', () => {
    let layerConf = {
      type: 'TILEWMS'
    };
    const style = LayerFactory.getInstance(layerConf);
    expect((style instanceof TileLayer)).to.equal(true);
  });

  it('has a correct formatMapping', () => {
    expect((LayerFactory.formatMapping.MVT)).to.equal(MvtFormat);
    expect((LayerFactory.formatMapping.GeoJSON)).to.equal(GeoJsonFormat);
    expect((LayerFactory.formatMapping.TopoJSON)).to.equal(TopoJsonFormat);
    expect((LayerFactory.formatMapping.KML)).to.equal(KmlFormat);
  });

  it('has a correct wfsFormatMapping', () => {
    expect((LayerFactory.wfsFormatMapping.GeoJSON)).to.equal('application/json');
    expect((LayerFactory.wfsFormatMapping.GML2)).to.equal('text/xml; subtype=gml/2.1.2');
    expect((LayerFactory.wfsFormatMapping.GML3)).to.equal('text/xml; subtype=gml/3.1.1');
    expect((LayerFactory.wfsFormatMapping.GML32)).to.equal('text/xml; subtype=gml/3.2');
  });

  describe('layer types', () => {
    it('createTileWmsLayer returns correct layer instance', () => {
      const layerConf = {
        'type': 'TILEWMS',
        'lid': 'ahocevar-wms',
        'format': 'image/png',
        'layers': 'topp:states',
        'url': 'https://ahocevar.com/geoserver/wms',
        'transparent': true,
        'projection': 'EPSG:3857',
        'attribution': 'Kindly provided by @ahocevar',
        'isBaseLayer': false,
        'visibility': false,
        'displayInLayerList': true,
        'params': {
          'foo': 'bar-tile'
        }
      };
      const layer = LayerFactory.createTileWmsLayer(layerConf);
      expect(layer instanceof TileLayer).to.equal(true);
      expect(layer.getSource() instanceof TileWmsSource);
      expect(layer.getSource().getParams().LAYERS).to.equal('topp:states');
      expect(layer.getSource().getParams().foo).to.equal('bar-tile');
    });

    it('createImageWmsLayer returns correct layer instance', () => {
      const layerConf = {
        'type': 'IMAGEWMS',
        'lid': 'ahocevar-imagewms',
        'ratio': 2,
        'format': 'image/png',
        'layers': 'ne:ne_10m_populated_places',
        'url': 'https://ahocevar.com/geoserver/wms',
        'transparent': true,
        'projection': 'EPSG:3857',
        'attribution': 'Kindly provided by @ahocevar',
        'isBaseLayer': false,
        'visibility': false,
        'displayInLayerList': true,
        'params': {
          'foo': 'bar-image'
        }
      };
      const layer = LayerFactory.createImageWmsLayer(layerConf);
      expect(layer instanceof ImageLayer).to.equal(true);
      expect(layer.getSource() instanceof ImageWMS);
      expect(layer.getSource().getParams().LAYERS).to.equal('ne:ne_10m_populated_places');
      expect(layer.getSource().getParams().foo).to.equal('bar-image');
    });

    it('createWfsLayer returns correct layer instance', () => {
      const layerConf = {
        'type': 'WFS',
        'lid': 'a-wfs',
        'url': 'https://a-wfs-url.de',
        'typeName': 'foo:tn',
        'version': '2.0.0',
        'format': 'GeoJSON',
        'formatConfig': {},
        'projection': 'EPSG:3857',
        'visible': true,
        'selectable': false
      };
      const olMap = new Map({
        view: new View({
          center: [0, 0],
          zoom: 1
        }),
        layers: []
      });
      const layer = LayerFactory.createWfsLayer(layerConf, olMap);
      expect(layer instanceof VectorLayer).to.equal(true);
      expect(layer.getSource() instanceof VectorSource);
    });

    it('createXyzLayer returns correct layer instance', () => {
      const layerConf = {
        'type': 'XYZ',
        'lid': 'a-xyz-layer',
        'visibility': true,
        'transparent': true,
        'displayInLayerList': false
      };
      const layer = LayerFactory.createXyzLayer(layerConf);
      expect(layer instanceof TileLayer).to.equal(true);
      expect(layer.getSource() instanceof XyzSource);
    });

    it('createOsmLayer returns correct layer instance', () => {
      const layerConf = {
        'type': 'OSM',
        'lid': 'a-osm-layer',
        'visibility': true,
        'transparent': true,
        'displayInLayerList': false
      };
      const layer = LayerFactory.createXyzLayer(layerConf);
      expect(layer instanceof TileLayer).to.equal(true);
      expect(layer.getSource() instanceof OsmSource);
    });

    it('createVectorLayer returns correct layer instance', () => {
      const layerConf = {
        'type': 'VECTOR',
        'lid': 'earthquakes',
        'url': './static/data/2012_Earthquakes_Mag5.kml',
        'formatConfig': {
          'extractStyles': false
        },
        'format': 'KML',
        'visible': true,
        'selectable': true,
        'hoverable': true,
        'hoverAttribute': 'name'
      };
      const layer = LayerFactory.createVectorLayer(layerConf);
      expect(layer instanceof VectorLayer).to.equal(true);
      expect(layer.getSource() instanceof VectorSource);
    });

    it('createVectorTileLayer returns correct layer instance', () => {
      const layerConf = {
        'type': 'VECTORTILE',
        'url': 'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
        'format': 'MVT',
        'visible': false,
        'styleRef': 'neWorldMvt'
      };
      const layer = LayerFactory.createVectorTileLayer(layerConf);
      expect(layer instanceof VectorTileLayer).to.equal(true);
      expect(layer.getSource() instanceof VectorTileSource);
    });
  });
});
