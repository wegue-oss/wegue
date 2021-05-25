import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import AppHeader from 'APP/components/AppHeader';

describe('AppHeader.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof AppHeader).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      Vue.prototype.$appConfig = {modules: {}};
      comp = shallowMount(AppHeader);
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.color).to.equal('red darken-3');
    });
  });

  describe('data', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(AppHeader);
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.title).to.equal(undefined);
      expect(vm.menuButtons).to.be.an('array');
      expect(vm.menuButtons.length).to.equal(0);
      expect(vm.tbButtons).to.be.an('array');
      expect(vm.tbButtons.length).to.equal(0);
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(AppHeader);
      vm = comp.vm;
    });

    it('getModuleButtons(\'menu\') returns always an array', () => {
      // mock a window UI instance
      const moduleData = vm.getModuleButtons('menu');
      expect(moduleData).to.be.an('array');
    });

    it('getModuleButtons(\'menu\') returns correct data', () => {
      // mock a module conf
      Vue.prototype.$appConfig = {modules: {
        'wgu-zoomtomaxextent': {
          target: 'menu',
          darkLayout: true
        }}};
      const moduleData = vm.getModuleButtons('menu');
      expect(moduleData).to.be.an('array');
      expect(moduleData.length).to.equal(1);
      expect(moduleData[0].type).to.equal('wgu-zoomtomaxextent-btn');
      expect(moduleData[0].target).to.equal('menu');
    });

    it('getModuleButtons(\'toolbar\') returns always an array', () => {
      // mock a window UI instance
      const moduleData = vm.getModuleButtons('toolbar');
      expect(moduleData).to.be.an('array');
    });

    it('getModuleButtons(\'toolbar\') returns correct data', () => {
      // mock a module conf
      Vue.prototype.$appConfig = {modules: {
        'wgu-zoomtomaxextent': {
          target: 'toolbar',
          darkLayout: true
        }}};
      const moduleData = vm.getModuleButtons('toolbar');
      expect(moduleData).to.be.an('array');
      expect(moduleData.length).to.equal(1);
      expect(moduleData[0].type).to.equal('wgu-zoomtomaxextent-btn');
      expect(moduleData[0].target).to.equal('toolbar');
    });
  });
});
