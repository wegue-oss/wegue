import { shallowMount } from '@vue/test-utils';
import AttributeTableWin from '@/components/attributeTable/AttributeTableWin';

function createWrapper () {
  return shallowMount(AttributeTableWin);
}

describe('attributeTable/AttributeTableWin.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(AttributeTableWin).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(AttributeTableWin.setup).to.be.a('function');
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
      expect(vm.moduleName).to.equal('wgu-attributetable');
      expect(vm.selLayerLid).to.be.null;
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
