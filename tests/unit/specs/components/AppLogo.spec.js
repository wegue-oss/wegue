import { shallowMount } from '@vue/test-utils';
import AppLogo from '@/components/AppLogo';

function createWrapper ($appConfig = {}) {
  return shallowMount(AppLogo, {
    global: {
      mocks: {
        $appConfig
      }
    }
  });
}

describe('AppLogo.vue', () => {
  it('sets the correct default data', () => {
    const comp = createWrapper();
    const vm = comp.vm;

    expect(vm.logoSrc).to.be.undefined;
    expect(vm.logoSize).to.be.undefined;
  });

  it('applies correct data from $appConfig', () => {
    const appConfig = {
      logo: 'foobar',
      logoSize: 100
    };
    const comp = createWrapper(appConfig);
    const vm = comp.vm;

    expect(vm.logoSrc).to.equal('foobar');
    expect(vm.logoSize).to.equal(100);
  });
});
