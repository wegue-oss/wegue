import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nMessages from '@/locales/en.json';
import WguAppTpl from 'APP/WguAppTemplate';

function createWrapper ($appConfig = {}) {
  const i18nInstance = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en: i18nMessages },
    missingWarn: false,
    fallbackWarn: false,
    warnHtmlMessage: false
  });

  return shallowMount(WguAppTpl, {
    global: {
      mocks: {
        $appConfig
      },
      plugins: [i18nInstance]
    }
  });
}

describe('WguAppTpl.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(WguAppTpl).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(WguAppTpl.setup).to.be.a('function');
  });

  it('has a created hook', () => {
    expect(WguAppTpl.created).to.be.a('function');
  });

  it('has a mounted hook', () => {
    expect(WguAppTpl.mounted).to.be.a('function');
  });

  describe('data', () => {
    it('has correct default data', () => {
      const appConfig = {
        showCopyrightYear: true,
        modules: {}
      };
      comp = createWrapper(appConfig);
      vm = comp.vm;

      expect(vm.isEmbedded).to.be.undefined;
      expect(vm.floatingWins).to.be.an('array');
      expect(vm.sidebarWins).to.be.an('array');
      expect(vm.showCopyrightYear).to.be.true;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('methods', () => {
    it('getModuleWinData(\'floating\') returns always an array', () => {
      comp = createWrapper();
      vm = comp.vm;

      // mock a window UI instance
      const moduleData = vm.getModuleWinData('floating');

      expect(moduleData).to.be.an('array');
    });

    it('getModuleWinData(\'sidebar\') returns always an array', () => {
      comp = createWrapper();
      vm = comp.vm;

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
      comp = createWrapper(appConfig);
      vm = comp.vm;

      const moduleData = vm.getModuleWinData('floating');

      expect(moduleData).to.be.an('array');
      expect(moduleData.length).to.equal(1);
      expect(moduleData[0].type).to.equal('wgu-infoclick-win');
      expect(moduleData[0].target).to.equal('menu');
      expect(moduleData[0].draggable).to.be.false;
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
      comp = createWrapper(appConfig);
      vm = comp.vm;

      const moduleData = vm.getModuleWinData('sidebar');

      expect(moduleData).to.be.an('array');
      expect(moduleData.length).to.equal(1);
      expect(moduleData[0].type).to.equal('wgu-infoclick-win');
      expect(moduleData[0].target).to.equal('menu');
    });

    it('has a method setGlobalAppLang', () => {
      comp = createWrapper();
      vm = comp.vm;

      expect(vm.setGlobalAppLang).to.be.a('function');
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('global app language lookup', () => {
    it('is set correctly', () => {
      comp = createWrapper();
      vm = comp.vm;

      expect(vm.$i18n.locale).to.equal(vm.vueInstance.appContext.config.globalProperties.$appLanguage);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
