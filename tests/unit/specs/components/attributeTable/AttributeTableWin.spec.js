import { shallowMount } from '@vue/test-utils';
import AttributeTableWin from '@/components/attributeTable/AttributeTableWin';

function createWrapper () {
  return shallowMount(AttributeTableWin);
}

describe('attributeTable/AttributeTableWin.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(typeof AttributeTableWin).to.not.equal('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('md:table_chart');
      expect(vm.syncTableMapSelection).to.be.false;
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
      // expect(vm.layers).to.be.an('array');
      // expect(vm.layers).to.have.lengthOf(0);
      // expect(vm.displayedLayers).to.be.an('array');
      // expect(vm.displayedLayers).to.have.lengthOf(0);
      expect(vm.selLayerLid).to.be.null;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  // describe('methods', () => {
  //   beforeEach(() => {
  //     comp = createWrapper();
  //     vm = comp.vm;
  //   });

  //   it('are implemented', () => {
  //     expect(vm.onMapBound).to.be.a('function');
  //   });

  //   afterEach(() => {
  //     comp.unmount();
  //   });
  // });
});
