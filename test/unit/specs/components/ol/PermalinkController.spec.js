import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import Map from '@/components/ol/Map';
const permalinkDef = {
  mapLayers: [{
    'type': 'OSM',
    'lid': 'osm-bg',
    'name': 'OSM',
    'isBaseLayer': false,
    'visible': true,
    'selectable': false,
    'displayInLayerList': true}],
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
  //
  // describe('data - PermalinkController successfully setup and applied', () => {
  //   let comp;
  //   let vm;
  //   beforeEach(() => {
  //     Vue.prototype.$appConfig = permalinkDef;
  //     comp = shallowMount(Map);
  //     vm = comp.vm;
  //   });
  //
  //   it('Setup permalinkController', () => {
  //     vm.permalinkController.setup();
  //     // vm.permalinkController.apply();
  //     // vm.permalinkController.getParamStr();
  //     expect(vm.permalinkController.getState().zoom).to.not.be.empty;
  //   });
  // });
});
