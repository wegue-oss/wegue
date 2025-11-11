import { shallowMount } from '@vue/test-utils';
import AttributeTable from '@/components/attributeTable/AttributeTable.vue';

function createWrapper () {
  return shallowMount(AttributeTable);
}

describe('attributeTable/AttributeTable.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(AttributeTable).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(AttributeTable.setup).to.be.a('function');
  });

  it('has a created hook', () => {
    expect(AttributeTable.created).to.be.a('function');
  });

  it('has a beforeUnmount hook', () => {
    expect(AttributeTable.beforeUnmount).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.layerId).to.be.null;
      expect(vm.uniqueRecordKeyName).to.equal('fid');
      expect(vm.rowsPerPage).to.equal(10);
      expect(vm.tableHeight).to.equal(272);
      expect(vm.syncTableMapSelection).to.be.true;
      expect(vm.forbiddenColumnNames).to.be.an('array').that.has.lengthOf(2);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.headers).to.be.an('array').that.is.empty;
      expect(vm.records).to.be.an('array').that.is.empty;
      expect(vm.features).to.be.an('array').that.is.empty;
      expect(vm.selectedRow).to.be.an('array').that.is.empty;
      expect(vm.layer).to.be.null;
      expect(vm.loading).to.be.true;
      expect(vm.page).to.equal(1);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(vm.highlightInitialFeatureSelectionInTable).to.be.a('function');
      expect(vm.getTableHeight).to.be.a('function');
      expect(vm.activateSelectRowOnMapClick).to.be.a('function');
      expect(vm.highlightRowFromSelectedFeature).to.be.a('function');
      expect(vm.onRowSelected).to.be.a('function');
      expect(vm.populateTable).to.be.a('function');
      expect(vm.prepareTableDataAndColumns).to.be.a('function');
      expect(vm.applyColumnMapping).to.be.a('function');
    });

    afterEach(() => {
      comp.unmount();
    });
  });
})
