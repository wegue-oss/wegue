import LayerUtil, { LayerProxy, LayerCollectionProxy } from '@/util/Layer';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';

describe('LayerUtil', () => {
  it('is defined', () => {
    expect(LayerUtil).to.not.be.an('undefined');
  });

  it('has the correct functions', () => {
    expect(LayerUtil.getLayersBy).to.be.a('function');
    expect(LayerUtil.getLayerByLid).to.be.a('function');
    expect(LayerUtil.zoomToLayerExtent).to.be.a('function');
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

    expect(layerArr).to.be.an('array').that.has.lengthOf(2);
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

    expect(layerArr).to.be.an('array').that.is.empty;
  });

  it('getLayersBy returns empty array if no OL map is passed', () => {
    const layerArr = LayerUtil.getLayersBy('foo', 'bar');

    expect(layerArr).to.be.an('array').that.is.empty;
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

    expect(layer).to.not.be.undefined;
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

    expect(layer).to.be.undefined;
  });

  it('getLayerByLid returns undefined if no OL map is passed', () => {
    const layer = LayerUtil.getLayerByLid('kalle');

    expect(layer).to.be.undefined;
  });

  it('zoomToLayerExtent zooms the map correctly', () => {
    const vectorLayer = new VectorLayer({
      lid: 'veclyr',
      source: new VectorSource()
    });

    const p1 = new Feature({ geometry: new Point([0, 0]) });
    const p2 = new Feature({ geometry: new Point([8, 8]) });
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

describe('LayerProxy', () => {
  it('is defined', () => {
    expect(LayerProxy).to.not.be.an('undefined');
  });

  it('has the correct functions', () => {
    expect(LayerProxy.prototype.get).to.be.a('function');
    expect(LayerProxy.prototype.getProperties).to.be.a('function');
    expect(LayerProxy.prototype.toRaw).to.be.a('function');
    expect(LayerProxy.prototype.destroy).to.be.a('function');
  });

  describe('methods', () => {
    let layer;
    let proxy;

    beforeEach(() => {
      layer = new TileLayer({
        foo: 'bar',
        source: new OSM()
      })
      proxy = new LayerProxy(layer);
    });

    it('get reflects layer properties', () => {
      expect(proxy.get('foo')).to.eql('bar');

      layer.set('foo', 'bar2');
      expect(proxy.get('foo')).to.eql('bar2');
    });

    it('getProperties reflects layer properties', () => {
      expect(proxy.getProperties()).to.deep.equal(layer.getProperties());

      layer.set('foo', 'bar2');
      expect(proxy.getProperties()).to.deep.equal(layer.getProperties());
    });

    it('toRaw returns the raw layer', () => {
      expect(proxy.toRaw()).to.equal(layer);
    });

    afterEach(() => {
      proxy.destroy();
    });
  });
});

describe('LayerCollectionProxy', () => {
  it('is defined', () => {
    expect(LayerCollectionProxy).to.not.be.an('undefined');
  });

  it('has the correct functions', () => {
    expect(LayerCollectionProxy.prototype.forEach).to.be.a('function');
    expect(LayerCollectionProxy.prototype.getArray).to.be.a('function');
    expect(LayerCollectionProxy.prototype.item).to.be.a('function');
    expect(LayerCollectionProxy.prototype.toRaw).to.be.a('function');
    expect(LayerCollectionProxy.prototype.destroy).to.be.a('function');
  });

  describe('methods', () => {
    let collection;
    let proxy;

    const layer1 = new TileLayer({
      foo: 'bar',
      source: new OSM()
    });
    const layer2 = new TileLayer({
      foo: 'bar2',
      source: new OSM()
    })
    const layer3 = new TileLayer({
      foo: 'bar3',
      source: new OSM()
    });

    beforeEach(() => {
      const map = new Map({
        layers: [layer1, layer2]
      });

      collection = map.getLayers();
      proxy = new LayerCollectionProxy(collection);
    });

    it('getArray reflects layer collection', () => {
      const layerProxies = proxy.getArray();
      const rawLayers = collection.getArray();

      expect(layerProxies.length).to.equal(rawLayers.length);
      for (let i = 0; i < rawLayers.length; i++) {
        expect(layerProxies[i].toRaw()).to.equal(rawLayers[i]);
      }

      collection.push(layer3);
      expect(layerProxies.length).to.equal(rawLayers.length);
      for (let i = 0; i < rawLayers.length; i++) {
        expect(layerProxies[i].toRaw()).to.equal(rawLayers[i]);
      }
    });

    it('forEach reflects layer collection', () => {
      const rawLayers = collection.getArray();
      let layerProxies = [];

      proxy.forEach(layerProxy => {
        layerProxies.push(layerProxy);
      });
      expect(layerProxies.length).to.equal(rawLayers.length);

      for (let i = 0; i < rawLayers.length; i++) {
        expect(layerProxies[i].toRaw()).to.equal(rawLayers[i]);
      }

      layerProxies = [];
      collection.push(layer3);

      proxy.forEach(layerProxy => {
        layerProxies.push(layerProxy);
      });
      expect(layerProxies.length).to.equal(rawLayers.length);

      for (let i = 0; i < rawLayers.length; i++) {
        expect(layerProxies[i].toRaw()).to.equal(rawLayers[i]);
      }
    });

    it('item reflects layer collection', () => {
      const rawLayers = collection.getArray();

      for (let i = 0; i < rawLayers.length; i++) {
        const layerProxy = proxy.item(i);
        expect(layerProxy.toRaw()).to.equal(rawLayers[i]);
      }

      collection.push(layer3);
      for (let i = 0; i < rawLayers.length; i++) {
        const layerProxy = proxy.item(i);
        expect(layerProxy.toRaw()).to.equal(rawLayers[i]);
      }
    });

    it('toRaw returns the raw collection', () => {
      expect(proxy.toRaw()).to.equal(collection);
    });

    afterEach(() => {
      proxy.destroy();
    });
  });
});
