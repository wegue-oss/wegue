import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import LocaleSwitcher from '@/components/localeswitcher/LocaleSwitcher';
import i18nMessages from '@/locales/en.json';

const appConfig = {
  lang: {
    supported: {
      en: 'English',
      pt: 'Portugues',
      de: 'Deutsch'
    },
    fallback: 'pt'
  }
};

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
  })

  return mount(LocaleSwitcher, {
    global: {
      mocks: {
        $appConfig
      },
      plugins: [i18nInstance]
    }
  });
}

describe('localeswitcher/LocaleSwitcher.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(LocaleSwitcher).to.not.be.an('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('md:language');
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper(appConfig);
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(typeof LocaleSwitcher.data).to.equal('function');
      expect(vm.lang).to.be.an('object');
      expect(Object.keys(vm.lang).length).to.eql(3);
      expect(vm.lang.en).to.eql('English');
      expect(vm.lang.de).to.eql('Deutsch');
      expect(vm.lang.pt).to.eql('Portugues');
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      comp = createWrapper(appConfig);
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(typeof vm.onItemClick).to.equal('function');
    });

    // For an unknown reason, this test alone passes but fails when run in the whole suite
    it('onItemClick toggles language', () => {
      vm.onItemClick('de');
      expect(vm.$i18n.locale).to.equal('de');
      expect(vm.vuetifyLang).to.equal('de');

      vm.onItemClick('en');
      expect(vm.$i18n.locale).to.equal('en');
      expect(vm.vuetifyLang).to.equal('en');
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
