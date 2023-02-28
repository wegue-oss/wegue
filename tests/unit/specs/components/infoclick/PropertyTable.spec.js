import { shallowMount } from '@vue/test-utils';
import PropertyTable from '@/components/infoclick/PropertyTable'

describe('infoclick/PropertyTable.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof PropertyTable).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(PropertyTable);
    });

    it('has correct default props', () => {
      expect(comp.vm.properties).to.equal(undefined);
    });
  });
});
