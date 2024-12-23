import { shallowMount } from '@vue/test-utils';
import PropertyTable from '@/components/infoclick/PropertyTable';

function createWrapper () {
  return shallowMount(PropertyTable);
}

describe('infoclick/PropertyTable.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(PropertyTable).to.not.be.an('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.properties).to.be.undefined;
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
