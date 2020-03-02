import LayerUtil from '@/util/Layer'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';

describe('LayerUtil', () => {
  it('is defined', () => {
    expect(typeof UrlUtil).to.not.equal(undefined);
  });

  it('has the correct functions', () => {
    expect(typeof LayerUtil.getLayersBy).to.equal('function');
    expect(typeof LayerUtil.getLayerByLid).to.equal('function');
    expect(typeof LayerUtil.zoomToLayerExtent).to.equal('function');
  });

  it('getLayersBy returns correct layers wrapped as array', () => {
    const olMap = new Map({
      layers: [
        new TileLayer({
          foo: 'bar',
          source: new OSM()
        }),
        new TileLayer({
          foo: 'bar',
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    const layerArr = LayerUtil.getLayersBy('foo', 'bar', olMap);
    expect(layerArr).to.be.an('array');
    expect(layerArr.length).to.eql(2);
  });

  it('getLayersBy returns empty array for non matching input params', () => {
    const olMap = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    const layerArr = LayerUtil.getLayersBy('foo', 'bar', olMap);
    expect(layerArr).to.be.an('array');
    expect(layerArr).to.eql([]);
  });

  it('getLayersBy returns empty array if no OL map is passed', () => {
    const layerArr = LayerUtil.getLayersBy('foo', 'bar');
    expect(layerArr).to.be.an('array');
    expect(layerArr).to.eql([]);
  });

  it('getLayerByLid returns correct layer', () => {
    const olMap = new Map({
      layers: [
        new TileLayer({
          lid: 'bar',
          name: 'Test',
          source: new OSM()
        }),
        new TileLayer({
          foo2: 'bar',
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    const layer = LayerUtil.getLayerByLid('bar', olMap);
    expect(typeof layer).to.not.equal(undefined);
    expect(layer).to.be.an('object');
    expect(layer.get('name')).to.eql('Test')
  });

  it('getLayerByLid returns undefined for non existing layer', () => {
    const olMap = new Map({
      layers: [
        new TileLayer({
          lid: 'bar',
          name: 'Test',
          source: new OSM()
        }),
        new TileLayer({
          foo2: 'bar',
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    const layer = LayerUtil.getLayerByLid('kalle', olMap);
    expect(layer).to.equal(undefined);
  });

  it('getLayerByLid returns undefined if no OL map is passed', () => {
    const layer = LayerUtil.getLayerByLid('kalle');
    expect(layer).to.equal(undefined);
  });

  it('zoomToLayerExtent zooms the map correctly', () => {
    const vectorLayer = new VectorLayer({
      lid: 'veclyr',
      source: new VectorSource()
    });

    const p1 = new Feature({geometry: new Point([0, 0])});
    const p2 = new Feature({geometry: new Point([8, 8])});
    vectorLayer.getSource().addFeatures([p1, p2]);

    const olMap = new Map({
      layers: [
        vectorLayer
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    LayerUtil.zoomToLayerExtent(vectorLayer, olMap);
    expect(Math.floor(olMap.getView().getZoom())).to.equal(20);
    expect(olMap.getView().getCenter()[0]).to.equal(4);
    expect(olMap.getView().getCenter()[1]).to.equal(4);
  });

  it('zoomToLayerExtent does not do anything if no valid vector layer is passed', () => {
    const olMap = new Map({
      layers: [],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    LayerUtil.zoomToLayerExtent(null, olMap);
    expect(olMap.getView().getZoom()).to.equal(2);
    expect(olMap.getView().getCenter()[0]).to.equal(0);
    expect(olMap.getView().getCenter()[1]).to.equal(0);
  });

  it('zoomToLayerExtent does not do anything if no valid OL map is passed', () => {
    const vecLayer = new VectorLayer({
      lid: 'veclyr',
      source: new VectorSource()
    });
    const olMap = new Map({
      layers: [
        vecLayer
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    LayerUtil.zoomToLayerExtent(vecLayer);
    expect(olMap.getView().getZoom()).to.equal(2);
    expect(olMap.getView().getCenter()[0]).to.equal(0);
    expect(olMap.getView().getCenter()[1]).to.equal(0);
  });
});
