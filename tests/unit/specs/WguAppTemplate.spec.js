import { shallowMount } from '@vue/test-utils';
import PortalVue from 'portal-vue';
import WguAppTpl from 'APP/WguAppTemplate';

function createWrapper ($appConfig = {}) {
  return shallowMount(WguAppTpl, {
    global: {
      mocks: {
        $appConfig
      },
      plugins: [PortalVue]
    }
  });
}

describe('WguAppTpl.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof WguAppTpl).to.not.equal('undefined');
  });

  describe('data', () => {
    const appConfig = {
      showCopyrightYear: true,
      modules: {}
    };

    it('has correct default data', () => {
      const comp = createWrapper(appConfig);
      const vm = comp.vm;

      expect(vm.isEmbedded).to.equal(undefined);
      expect(vm.floatingWins).to.be.an('array');
      expect(vm.sidebarWins).to.be.an('array');
      expect(vm.showCopyrightYear).to.equal(true);
    });
  });

  describe('methods', () => {
    it('getModuleWinData(\'floating\') returns always an array', () => {
      const comp = createWrapper();
      const vm = comp.vm;

      // mock a window UI instance
      const moduleData = vm.getModuleWinData('floating');

      expect(moduleData).to.be.an('array');
    });

    it('getModuleWinData(\'sidebar\') returns always an array', () => {
      const comp = createWrapper();
      const vm = comp.vm;

      // mock a window UI instance
      const moduleData = vm.getModuleWinData('sidebar');

      expect(moduleData).to.be.an('array');
    });

    it('getModuleWinData(\'floating\') returns correct data', () => {
      // mock a module conf
      const appConfig = {
        modules: {
          'wgu-infoclick': {
            icon: 'md:info',
            target: 'menu',
            win: 'floating',
            draggable: false,
            initPos: {
              left: 8,
              top: 16
            }
          }
        }
      };
      const comp = createWrapper(appConfig);
      const vm = comp.vm;

      const moduleData = vm.getModuleWinData('floating');

      expect(moduleData).to.be.an('array');
      expect(moduleData.length).to.equal(1);
      expect(moduleData[0].type).to.equal('wgu-infoclick-win');
      expect(moduleData[0].target).to.equal('menu');
      expect(moduleData[0].draggable).to.equal(false);
      expect(moduleData[0].initPos.left).to.equal(8);
      expect(moduleData[0].initPos.top).to.equal(16);
    });

    it('getModuleWinData(\'sidebar\') returns correct data', () => {
      // mock a module conf
      const appConfig = {
        modules: {
          'wgu-infoclick': {
            icon: 'md:info',
            target: 'menu',
            win: 'sidebar'
          }
        }
      };
      const comp = createWrapper(appConfig);
      const vm = comp.vm;

      const moduleData = vm.getModuleWinData('sidebar');

      expect(moduleData).to.be.an('array');
      expect(moduleData.length).to.equal(1);
      expect(moduleData[0].type).to.equal('wgu-infoclick-win');
      expect(moduleData[0].target).to.equal('menu');
    });

    it('has a method setGlobalAppLang', () => {
      const comp = createWrapper();
      const vm = comp.vm;

      expect(vm.setGlobalAppLang).to.be.a('function');
    });
  });

  describe('global app language lookup', () => {
    it('is set correctly', () => {
      const comp = createWrapper();
      const vm = comp.vm;

      expect(vm.$i18n.locale).to.equal(vm.vueInstance.appContext.config.globalProperties.$appLanguage);
    });
  });
});
