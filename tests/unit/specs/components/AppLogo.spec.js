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
  let comp;
  let vm;

  it('is defined', () => {
    expect(AppLogo).to.not.be.an('undefined');
  });

  it('has a created hook', () => {
    expect(AppLogo.created).to.be.a('function');
  });

  describe('data', () => {
    it('has correct default data', () => {
      comp = createWrapper();
      vm = comp.vm;

      expect(vm.logoSrc).to.be.undefined;
      expect(vm.logoSize).to.be.undefined;
      expect(vm.logoWidth).to.be.undefined;
      expect(vm.logoHeight).to.be.undefined;
    });

    it('applies correct data from $appConfig', () => {
      const appConfig = {
        logo: 'foobar',
        logoSize: 100
      };
      comp = createWrapper(appConfig);
      vm = comp.vm;

      expect(vm.logoSrc).to.equal('foobar');
      expect(vm.logoSize).to.equal(100);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
