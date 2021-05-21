import Vue from 'vue';
import AttributeTableWin from '@/components/attributeTable/AttributeTableWin'
import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';

const appConfig = {modules: { 'wgu-attributetable': {} }};

describe('attributeTable/AttributeTableWin.vue', () => {
  it('is defined', () => {
    expect(typeof AttributeTableWin).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      Vue.prototype.$appConfig = appConfig;
      comp = shallowMount(AttributeTableWin);
    });

    it('has correct default props', () => {
      expect(comp.vm.icon).to.equal('table_chart');
      expect(comp.vm.title).to.be.a('String');
      expect(comp.vm.selectorLabel).to.be.a('String');
    });

    afterEach(() => {
      comp.destroy();
      Vue.prototype.$appConfig = undefined;
    });
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(AttributeTableWin.data).to.be.a('function');
    const defaultData = AttributeTableWin.data();
    expect(defaultData).to.be.an('object');

    expect(defaultData.layerId).to.be.null;
    expect(defaultData.layerItems).to.be.null;
    expect(defaultData.selectedItem).to.be.null;
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      Vue.prototype.$appConfig = appConfig;
      comp = shallowMount(AttributeTableWin);
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(vm.onResize).to.be.a('function');
      expect(vm.resizeOlMap).to.be.a('function');
      expect(vm.handleLayerSelect).to.be.a('function');
      expect(vm.onMapBound).to.be.a('function');
      expect(vm.populateLayerItems).to.be.a('function');
    });
  });
});
