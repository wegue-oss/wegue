import { DraggableWin } from '@/directives/DraggableWin'
// import TileLayer from 'ol/layer/Tile';
// import TileWmsSource from 'ol/source/TileWMS';
// import OsmSource from 'ol/source/OSM';
// import VectorTileLayer from 'ol/layer/VectorTile';
// import VectorTileSource from 'ol/source/VectorTile';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import XyzSource from 'ol/source/XYZ';
// import MvtFormat from 'ol/format/MVT'
// import GeoJsonFormat from 'ol/format/GeoJSON'
// import TopoJsonFormat from 'ol/format/TopoJSON'
// import KmlFormat from 'ol/format/KML'

describe('DraggableWin Directive', () => {
  it('is defined', () => {
    expect(typeof DraggableWin).to.not.equal(undefined);
  });

  // it('has the correct functions', () => {
  //   expect(typeof LayerFactory.getInstance).to.equal('function');
  //   expect(typeof LayerFactory.createWmsLayer).to.equal('function');
  //   expect(typeof LayerFactory.createXyzLayer).to.equal('function');
  //   expect(typeof LayerFactory.createOsmLayer).to.equal('function');
  //   expect(typeof LayerFactory.createVectorLayer).to.equal('function');
  //   expect(typeof LayerFactory.createVectorTileLayer).to.equal('function');
  // });

  describe('functions', () => {
    describe('bind', () => {
      it('exits if binding.value=false', () => {
        DraggableWin.bind(null, { value: false });
        expect(DraggableWin.dragConfig.draggableElementSelector).to.equal(null);
      });

      it('exits if no header in elem', () => {
        const mockDomEl = document.createElement('div');

        DraggableWin.bind(mockDomEl, { value: true });
        expect(DraggableWin.dragConfig.draggableElementSelector).to.equal(null);
      });

      it('sets correct default draggableElementSelector', () => {
        const mockDomEl = document.createElement('div');
        const mockHeaderEl = document.createElement('div');
        mockHeaderEl.classList.add('wgu-win-title');
        mockDomEl.append(mockHeaderEl);

        DraggableWin.bind(mockDomEl, { arg: false, value: true });
        expect(DraggableWin.dragConfig.draggableElementSelector).to.equal('wgu-win-title');
        // cleanup
        mockHeaderEl.parentNode.removeChild(mockHeaderEl);
      });

      it('applies draggableElementSelector from bindig.arg', () => {
        const mockDomEl = document.createElement('div');
        const mockHeaderEl = document.createElement('div');
        mockHeaderEl.classList.add('wgu-win-title');
        mockDomEl.append(mockHeaderEl);

        DraggableWin.bind(mockDomEl, { arg: 'kalle', value: true });
        expect(DraggableWin.dragConfig.draggableElementSelector).to.equal('kalle');
        // cleanup
        mockHeaderEl.parentNode.removeChild(mockHeaderEl);
      });
    });
  });

  describe('events', () => {
    describe('mouseup', () => {
      it('calls correct handler', () => {
        const mockDomEl = document.createElement('div');
        const mockHeaderEl = document.createElement('div');
        mockHeaderEl.classList.add('wgu-win-title');
        mockDomEl.append(mockHeaderEl);

        DraggableWin.bind(mockDomEl, { arg: false, value: true });

        let cnt = 0;
        DraggableWin.mouseup = () => {
          cnt++;
        }

        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mouseup', true, true);
        mockDomEl.dispatchEvent(clickEvent);

        expect(cnt).to.equal(1);
      });
    });

    describe('mousedown', () => {
      it('calls correct handler', () => {
        const mockDomEl = document.createElement('div');
        const mockHeaderEl = document.createElement('div');
        mockHeaderEl.classList.add('wgu-win-title');
        mockDomEl.append(mockHeaderEl);

        DraggableWin.bind(mockDomEl, { arg: false, value: true });

        let cnt = 0;
        DraggableWin.mousedown = () => {
          cnt++;
        }

        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        mockDomEl.dispatchEvent(clickEvent);

        expect(cnt).to.equal(1);
      });
    });

    describe('mousemove', () => {
      it('calls correct handler', () => {
        const mockDomEl = document.createElement('div');
        const mockHeaderEl = document.createElement('div');
        mockHeaderEl.classList.add('wgu-win-title');
        mockDomEl.append(mockHeaderEl);

        DraggableWin.bind(mockDomEl, { arg: false, value: true });

        let cnt = 0;
        DraggableWin.mousemove = () => {
          cnt++;
        }

        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousemove', true, true);
        mockDomEl.dispatchEvent(clickEvent);

        expect(cnt).to.equal(1);
      });
    });
  });

  // it('getInstance returns correct instance', () => {
  //   let layerConf = {
  //     type: 'TILEWMS'
  //   };
  //   const style = LayerFactory.getInstance(layerConf);
  //   expect((style instanceof TileLayer)).to.equal(true);
  // });
  //
  // it('has a correct formatMapping', () => {
  //   expect((LayerFactory.formatMapping.MVT)).to.equal(MvtFormat);
  //   expect((LayerFactory.formatMapping.GeoJSON)).to.equal(GeoJsonFormat);
  //   expect((LayerFactory.formatMapping.TopoJSON)).to.equal(TopoJsonFormat);
  //   expect((LayerFactory.formatMapping.KML)).to.equal(KmlFormat);
  // });
  //
  // describe('layer types', () => {
  //   it('createWmsLayer returns correct layer instance', () => {
  //     const layerConf = {
  //       'type': 'TILEWMS',
  //       'lid': 'ahocevar-wms',
  //       'name': 'WMS (ahocevar)',
  //       'format': 'image/png',
  //       'layers': 'topp:states',
  //       'url': 'https://ahocevar.com/geoserver/wms',
  //       'transparent': true,
  //       'projection': 'EPSG:3857',
  //       'attribution': '',
  //       'isBaseLayer': false,
  //       'visibility': false,
  //       'displayInLayerList': true
  //     };
  //     const layer = LayerFactory.createWmsLayer(layerConf);
  //     expect(layer instanceof TileLayer).to.equal(true);
  //     expect(layer.getSource() instanceof TileWmsSource);
  //   });
  //
  //   it('createXyzLayer returns correct layer instance', () => {
  //     const layerConf = {
  //       'type': 'XYZ',
  //       'lid': 'a-xyz-layer',
  //       'name': 'foo bar',
  //       'visibility': true,
  //       'transparent': true,
  //       'displayInLayerList': false
  //     };
  //     const layer = LayerFactory.createXyzLayer(layerConf);
  //     expect(layer instanceof TileLayer).to.equal(true);
  //     expect(layer.getSource() instanceof XyzSource);
  //   });
  //
  //   it('createOsmLayer returns correct layer instance', () => {
  //     const layerConf = {
  //       'type': 'OSM',
  //       'lid': 'a-osm-layer',
  //       'name': 'OSMOSM',
  //       'visibility': true,
  //       'transparent': true,
  //       'displayInLayerList': false
  //     };
  //     const layer = LayerFactory.createXyzLayer(layerConf);
  //     expect(layer instanceof TileLayer).to.equal(true);
  //     expect(layer.getSource() instanceof OsmSource);
  //   });
  //
  //   it('createVectorLayer returns correct layer instance', () => {
  //     const layerConf = {
  //       'type': 'VECTOR',
  //       'lid': 'earthquakes',
  //       'name': 'Earthquakes 2012 (Mag 5)',
  //       'url': './static/data/2012_Earthquakes_Mag5.kml',
  //       'formatConfig': {
  //         'extractStyles': false
  //       },
  //       'format': 'KML',
  //       'visible': true,
  //       'selectable': true,
  //       'hoverable': true,
  //       'hoverAttribute': 'name'
  //     };
  //     const layer = LayerFactory.createVectorLayer(layerConf);
  //     expect(layer instanceof VectorLayer).to.equal(true);
  //     expect(layer.getSource() instanceof VectorSource);
  //   });
  //
  //   it('createVectorTileLayer returns correct layer instance', () => {
  //     const layerConf = {
  //       'type': 'VECTORTILE',
  //       'name': 'Vector Tile Layer',
  //       'url': 'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
  //       'format': 'MVT',
  //       'visible': false,
  //       'styleRef': 'neWorldMvt'
  //     };
  //     const layer = LayerFactory.createVectorTileLayer(layerConf);
  //     expect(layer instanceof VectorTileLayer).to.equal(true);
  //     expect(layer.getSource() instanceof VectorTileSource);
  //   });
  // });
});
