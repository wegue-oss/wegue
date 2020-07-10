import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import Map from '@/components/ol/Map';
const permalinkDef = {
  mapZoom: 2,
  mapCenter: [0, 0],
  mapLayers: [{
    'type': 'OSM',
    'lid': 'osm-bg',
    'name': 'OSM',
    'isBaseLayer': false,
    'visible': true,
    'selectable': false,
    'displayInLayerList': true
  },
  {
    'type': 'WMS',
    'lid': 'ahocevar-wms',
    'name': 'WMS (ahocevar)',
    'format': 'image/png',
    'layers': 'topp:states',
    'url': 'https://ahocevar.com/geoserver/wms',
    'transparent': true,
    'singleTile': false,
    'projection': 'EPSG:3857',
    'attribution': '',
    'isBaseLayer': false,
    'visible': false,
    'displayInLayerList': true
  }],
  permalink: {
    'location': 'hash',
    'layers': true,
    'extent': false,
    'projection': 'EPSG:4326',
    'paramPrefix': '',
    'history': true
  }
};

describe('ol/Map.vue', () => {
  describe('data - Map NOT Provides PermalinkController when NOT defined', () => {
    let comp;
    let vm;
    beforeEach(() => {
      Vue.prototype.$appConfig = {};
      comp = shallowMount(Map);
      vm = comp.vm;
    });

    it('Map has NOT instantiated permalinkController', () => {
      expect(vm.permalinkController).to.equal(undefined);
    });
  });

  describe('data - Map Provides PermalinkController when defined', () => {
    let comp;
    let vm;
    beforeEach(() => {
      Vue.prototype.$appConfig = permalinkDef;
      comp = shallowMount(Map);
      vm = comp.vm;
    });

    it('Map has instantiated permalinkController', () => {
      expect(vm.permalinkController).to.not.be.empty;
    });
  });

  describe('data - PermalinkController successfully setup', () => {
    let comp;
    let vm;
    beforeEach(() => {
      Vue.prototype.$appConfig = permalinkDef;
      comp = shallowMount(Map);
      vm = comp.vm;
    });

    it('Setup permalinkController', () => {
      vm.permalinkController.setup();
      expect(vm.permalinkController.shouldUpdate).equals(true);
    });
  });

  describe('data - PermalinkController up to date with Map View', () => {
    let comp;
    let vm;
    beforeEach(() => {
      Vue.prototype.$appConfig = permalinkDef;
      comp = shallowMount(Map);
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
    });
  });
  describe('data - PermalinkController applied from document.location.hash/search', () => {
    let comp;
    let vm;
    beforeEach(() => {
      Vue.prototype.$appConfig = permalinkDef;
      comp = shallowMount(Map);
      vm = comp.vm;
    });

    it('Setup and apply permalinkController - apply from document.location.hash', () => {
      vm.permalinkController.setup();
      document.location.hash = '#z=4&c=4%2C52&r=0&l=ahocevar-wms%2Cosm-bg';
      vm.permalinkController.apply();
      expect(vm.permalinkController.getState().zoom).to.equal(4);
      expect(vm.permalinkController.getParamStr()).to.equal(document.location.hash);
      // Map View should reflect hash string above (in Web Merc projection)
      const map = vm.map;
      const mapView = map.getView();
      expect(mapView.getZoom()).to.equal(4);
      expect(Math.round(mapView.getCenter()[0])).to.equal(445278);
      expect(Math.round(mapView.getCenter()[1])).to.equal(6800125);
      expect(Math.round(map.getLayers().getLength())).to.equal(2);
    });
    // Below gives problems in Karma as the document is reloaded by setting document.locaiton.search!
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
  });
});
