import { nextTick } from 'vue';
import { shallowMount } from '@vue/test-utils';
import AppLoadingMask from '@/components/AppLoadingMask.vue';
import { WguEventBus } from '@/WguEventBus';

function createWrapper () {
  return shallowMount(AppLoadingMask);
}

describe('AppLoadingMask.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(AppLoadingMask).to.not.be.an('undefined');
  });

  it('has a created hook', () => {
    expect(AppLoadingMask.created).to.be.a('function');
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.show).to.be.false;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('events', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('event "app-loading-mask-toggle" forces correct visibility', async () => {
      // force showing by adding 'true' parameter
      WguEventBus.$emit('app-loading-mask-toggle', true);
      await nextTick();

      expect(vm.show).to.be.true;

      // toggle visibility by skipping parameter
      WguEventBus.$emit('app-loading-mask-toggle');
      await nextTick();

      expect(vm.show).to.be.false;
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
