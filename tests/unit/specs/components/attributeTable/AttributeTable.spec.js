import { shallowMount } from '@vue/test-utils';
import AttributeTable from '@/components/attributeTable/AttributeTable';

function createWrapper () {
  return shallowMount(AttributeTable);
}

describe('attributeTable/AttributeTable.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(typeof AttributeTable).to.not.equal('undefined');
  });

  it('has a created hook', () => {
    expect(AttributeTable.created).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.layerId).to.be.null;
      expect(vm.loadingText).to.not.be.null;
      expect(vm.uniqueRecordKeyName).to.not.be.null;

      expect(vm.rowsPerPage).to.be.a('number');
      expect(vm.tableHeight).to.be.a('number');
      expect(vm.syncTableMapSelection).to.be.a('boolean');
      expect(vm.forbiddenColumnNames).to.be.an.instanceof(Array);
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
      expect(vm.headers).to.be.an('array');
      expect(vm.headers).to.have.lengthOf(0);
      expect(vm.records).to.be.an('array');
      expect(vm.records).to.have.lengthOf(0);
      expect(vm.features).to.be.an('array');
      expect(vm.features).to.have.lengthOf(0);
      expect(vm.selectedRow).to.be.an('array');
      expect(vm.selectedRow).to.have.lengthOf(0);
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
