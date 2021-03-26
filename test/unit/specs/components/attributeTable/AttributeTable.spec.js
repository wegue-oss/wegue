import Vue from 'vue';
import AttributeTable from '@/components/attributeTable/AttributeTable';
import { expect } from 'chai';
import { shallowMount, mount } from '@vue/test-utils';

const appConfig = {modules: { 'wgu-attributetable': {} }};

describe('attributeTable/AttributeTable.vue', () => {
  it('is defined', () => {
    expect(typeof AttributeTable).to.not.equal('undefined');
  });

  it('has a created hook', () => {
    expect(AttributeTable.created).to.be.a('function');
  });

  it('sets the correct default data', () => {
    expect(AttributeTable.data).to.be.a('function');
    const defaultData = AttributeTable.data();
    expect(defaultData).to.be.an('object');

    expect(defaultData.headers).to.be.an('array');
    expect(defaultData.headers.length).to.eql(0);

    expect(defaultData.records).to.be.an('array');
    expect(defaultData.records.length).to.eql(0);

    expect(defaultData.records).to.eql([]);
    expect(defaultData.headers).to.eql([]);

    expect(defaultData.page).to.eql(1);
    expect(defaultData.loading).to.eql(true);
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      Vue.prototype.$appConfig = appConfig;
      comp = mount(AttributeTable);
    });

    it('has correct default props', () => {
      expect(comp.vm.layerId).to.be.null;
      expect(comp.vm.loadingText).to.not.be.null;
      expect(comp.vm.forbiddenColumnNames).to.be.an.instanceof(Array);
    });

    afterEach(() => {
      comp.destroy();
      Vue.prototype.$appConfig = undefined;
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(AttributeTable);
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(vm.populateTable).to.be.a('function');
      expect(vm.applyRecordsFromOlLayer).to.be.a('function');
      expect(vm.applyColumnMapping).to.be.a('function');
    });
  });
})
