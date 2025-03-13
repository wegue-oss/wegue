import { shallowMount } from '@vue/test-utils';
import MapLoadingStatus from '@/components/progress/MapLoadingStatus';

function createWrapper () {
  return shallowMount(MapLoadingStatus);
}

describe('progress/MapLoadingStatus.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(MapLoadingStatus).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(MapLoadingStatus.setup).to.be.a('function');
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.loading).to.equal(0);
      expect(vm.visible).to.be.false;
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
