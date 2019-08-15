import { shallowMount } from '@vue/test-utils';
import Geocoder from '@/components/geocoder/Geocoder';

describe('geocoder/Geocoder.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof Geocoder).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(Geocoder);
    });

    it('has correct default props', () => {
      expect(comp.vm.buttonIcon).to.equal('search');
      expect(comp.vm.rounded).to.equal(true);
      expect(comp.vm.autofocus).to.equal(true);
      expect(comp.vm.dark).to.equal(false);
      expect(comp.vm.persistentHint).to.equal(true);
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(Geocoder);
    });

    it('has correct default data', () => {
      expect(comp.vm.hideSearch).to.equal(true);
    });
  });
});
