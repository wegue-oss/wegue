import Vue from 'vue';
import Vuetify from 'vuetify'
import AttributeTable from '@/components/attributeTable/AttributeTable';
import { expect } from 'chai';
import {shallowMount} from '@vue/test-utils';

const appConfig = {modules: { 'wgu-attributetable-win': {
  syncTableMapSelection: true
} }};

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

    expect(defaultData.features).to.be.an('array');
    expect(defaultData.features.length).to.eql(0);

    expect(defaultData.selectedRow).to.be.an('array');
    expect(defaultData.selectedRow.length).to.eql(0);

    expect(defaultData.layer).to.be.null;

    expect(defaultData.loading).to.eql(true);

    expect(defaultData.page).to.eql(1);
  });

  describe('props', () => {
    let comp;
    let vuetify;

    beforeEach(() => {
      Vue.prototype.$appConfig = appConfig;
      vuetify = new Vuetify()

      comp = shallowMount(AttributeTable, {
        mocks: {
          $vuetify: {
            breakpoint: {
              t: (val) => val
            }
          }
        },
        vuetify
      });
    });

    it('has correct default props', () => {
      expect(comp.vm.layerId).to.be.null;
      expect(comp.vm.loadingText).to.not.be.null;
      expect(comp.vm.uniqueRecordKeyName).to.not.be.null;

      expect(comp.vm.rowsPerPage).to.be.a('number');
      expect(comp.vm.tableHeight).to.be.a('number');
      expect(comp.vm.syncTableMapSelection).to.be.a('boolean');
      expect(comp.vm.maxZoomOnFeature).to.be.a('number');
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
    let vuetify;
    beforeEach(() => {
      vuetify = new Vuetify()

      comp = shallowMount(AttributeTable, {
        mocks: {
          $vuetify: {
            breakpoint: {
              t: (val) => val
            }
          }
        },
        vuetify
      });
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(vm.highlightInitialFeatureSelectionInTable).to.be.a('function');
      expect(vm.getTableHeight).to.be.a('function');
      expect(vm.activateSelectRowOnMapClick).to.be.a('function');
      expect(vm.highlightRowFromSelectedFeature).to.be.a('function');
      expect(vm.onRowClick).to.be.a('function');
      expect(vm.populateTable).to.be.a('function');
      expect(vm.prepareTableDataAndColumns).to.be.a('function');
      expect(vm.applyColumnMapping).to.be.a('function');
    });
  });
})
