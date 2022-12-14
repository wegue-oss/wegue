import AppLoadingMask from '@/components/AppLoadingMask';
import { WguEventBus } from '@/WguEventBus';
import { shallowMount } from '@vue/test-utils';

describe('AppLoadingMask.vue', () => {
  it('sets the correct default data', () => {
    AppLoadingMask.$appConfig = {};
    expect(typeof AppLoadingMask.data).to.equal('function');
    const data = AppLoadingMask.data();
    expect(data.show).to.equal(false);
  });

  describe('events', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(AppLoadingMask, {});
      vm = comp.vm;
    });

    it('event "app-loading-mask-toggle" forces correct visibility', done => {
      // force showing by adding 'true' parameter
      WguEventBus.$emit('app-loading-mask-toggle', true);
      vm.$nextTick(() => {
        expect(vm.show).to.equal(true);

        // toggle visibility by skipping parameter
        WguEventBus.$emit('app-loading-mask-toggle');
        vm.$nextTick(() => {
          expect(vm.show).to.equal(false);
          done();
        });
      });
    });
  });
});
