import { mount } from '@vue/test-utils';
import Map from '@/components/ol/Map';
import VectorLayer from 'ol/layer/Vector';

const permalinkDef = {
  mapZoom: 2,
  mapCenter: [0, 0],
  mapLayers: [{
    type: 'OSM',
    lid: 'osm-bg',
    isBaseLayer: false,
    visible: true,
    selectable: false,
    displayInLayerList: false
  },
  {
    type: 'TILEWMS',
    lid: 'ahocevar-wms',
    format: 'image/png',
    layers: 'topp:states',
    url: 'https://ahocevar.com/geoserver/wms',
    transparent: true,
    projection: 'EPSG:3857',
    attribution: '',
    isBaseLayer: false,
    visible: false,
    displayInLayerList: true
  },
  {
    type: 'IMAGEWMS',
    lid: 'ahocevar-imagewms',
    format: 'image/png',
    layers: 'ne:ne_10m_populated_places',
    url: 'https://ahocevar.com/geoserver/wms',
    transparent: true,
    projection: 'EPSG:3857',
    attribution: '',
    isBaseLayer: false,
    visible: false,
    displayInLayerList: true
  },
  {
    type: 'OSM',
    lid: 'permalink-excluded-layer',
    isBaseLayer: false,
    visible: true,
    selectable: false,
    displayInLayerList: false,
    supportsPermalink: false
  }],
  permalink: {
    location: 'hash',
    layers: true,
    extent: false,
    projection: 'EPSG:4326',
    paramPrefix: '',
    history: true
  },
  modules: {}
};

document.location.hash = '';

function createWrapper ($appConfig = {}) {
  return mount(Map, {
    global: {
      mocks: {
        $appConfig
      }
    }
  });
}

describe('ol/Map.vue', () => {
  let comp;
  let vm;

  describe('data - Map NOT Provides PermalinkController when NOT defined', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('Map has NOT instantiated permalinkController', () => {
      expect(vm.permalinkController).to.equal(undefined);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data - Map Provides PermalinkController when defined', () => {
    beforeEach(() => {
      comp = createWrapper(permalinkDef);
      vm = comp.vm;
    });

    it('Map has instantiated permalinkController', () => {
      expect(vm.permalinkController).to.not.be.empty;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data - PermalinkController successfully setup', () => {
    beforeEach(() => {
      comp = createWrapper(permalinkDef);
      vm = comp.vm;
    });

    it('Setup permalinkController', () => {
      expect(vm.permalinkController.shouldUpdate).equals(true);
      expect(vm.map.getLayers().getLength()).to.equal(4);
      vm.permalinkController.unsubscribeLayers();
      expect(vm.permalinkController.layerListeners.length).to.equal(0);
      vm.permalinkController.subscribeLayers();
      expect(vm.permalinkController.layerListeners.length).to.equal(4);
    });

    it('Layer Listeners are (re)created when the layer stack changes', () => {
      vm.map.addLayer(new VectorLayer());
      expect(vm.permalinkController.layerListeners.length).to.equal(5);
      expect(vm.map.getLayers().getLength()).to.equal(5);
      vm.permalinkController.unsubscribeLayers();
      expect(vm.permalinkController.layerListeners.length).to.equal(0);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data - PermalinkController up to date with Map View', () => {
    beforeEach(() => {
      comp = createWrapper(permalinkDef);
      vm = comp.vm;
    });

    it('Setup and apply permalinkController - defaults', () => {
      vm.permalinkController.setup();
      expect(vm.permalinkController.getState().zoom).to.equal(permalinkDef.mapZoom);
      expect(vm.permalinkController.getParamStr()).to.equal('#z=2&c=0%2C0&r=0&l=osm-bg');
    });

    it('Setup and apply permalinkController - modify Map View', () => {
      vm.permalinkController.setup();
      const mapView = vm.map.getView();
      const newZoom = 8;
      const newCenter = [1000000, 2000000];
      mapView.setZoom(newZoom);
      mapView.setCenter(newCenter);
      expect(vm.permalinkController.getState().zoom).to.equal(newZoom);
      // Map coordinates in Web Mercator converted to WGS84!
      expect(vm.permalinkController.getParamStr()).to.equal('#z=' + newZoom + '&c=8.9832%2C17.6789&r=0&l=osm-bg');
      // Make each Layer visible: must change param string to contain all Layers.
      vm.map.getLayers().forEach((layer) => {
        if (layer.getVisible() === false) {
          layer.setVisible(true);
        }
      });
      expect(vm.permalinkController.getParamStr()).to.equal('#z=' + newZoom + '&c=8.9832%2C17.6789&r=0&l=ahocevar-imagewms%2Cahocevar-wms%2Cosm-bg');
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data - PermalinkController applied from document.location.hash/search', () => {
    beforeEach(() => {
      comp = createWrapper(permalinkDef);
      vm = comp.vm;
    });

    it('Setup and apply permalinkController - apply from document.location.hash', () => {
      vm.permalinkController.setup();
      document.location.hash = '#z=4&c=4%2C52&r=0&l=osm-bg%2Cahocevar-wms';
      vm.permalinkController.apply();
      expect(vm.permalinkController.getState().zoom).to.equal(4);
      expect(vm.permalinkController.getParamStr()).to.equal(document.location.hash);
      // Map View should reflect hash string above (in Web Merc projection)
      const map = vm.map;
      const mapView = map.getView();
      expect(mapView.getZoom()).to.equal(4);
      expect(Math.round(mapView.getCenter()[0])).to.equal(445278);
      expect(Math.round(mapView.getCenter()[1])).to.equal(6800125);
      expect(Math.round(map.getLayers().getLength())).to.equal(4);
    });
    // Below gives problems in Karma as the document is reloaded by setting document.location.search!
    // it('Setup and apply permalinkController - apply from document.location.search', () => {
    //   permalinkDef.permalink.location = 'search';
    //   vm.permalinkController.setup();
    //   document.location.search = '?z=4&c=4%2C52&r=0&l=ahocevar-wms%2Cosm-bg';
    //   vm.permalinkController.apply();
    //   expect(vm.permalinkController.getState().zoom).to.equal(4);
    //   expect(vm.permalinkController.getParamStr()).to.equal(document.location.search);
    //   // Map View should reflect search string above (in Web Merc projection)
    //   const map = vm.map;
    //   const mapView = map.getView();
    //   expect(mapView.getZoom()).to.equal(4);
    //   expect(Math.round(mapView.getCenter()[0])).to.equal(445278);
    //   expect(Math.round(mapView.getCenter()[1])).to.equal(6800125);
    //   expect(Math.round(map.getLayers().getLength())).to.equal(2);
    // });

    afterEach(() => {
      comp.unmount();
    });
  });
});
