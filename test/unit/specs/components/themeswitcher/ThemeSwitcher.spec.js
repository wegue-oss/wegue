import { createLocalVue, mount } from '@vue/test-utils';
import ThemeSwitcher from '@/components/themeswitcher/ThemeSwitcher'
import Vuetify from 'vuetify'

describe('themeswitcher/ThemeSwitcher.vue', () => {
  const localVue = createLocalVue();
  let vuetify;

  const defaultProps = {
    moduleName: 'wgu-toolbar',
    icon: 'dark_mode'
  }

  beforeEach(() => {
    vuetify = new Vuetify()
  });

  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof ThemeSwitcher).to.not.equal('undefined');
  });

  describe('unconfigured', () => {
    let comp;

    beforeEach(() => {
      comp = mount(ThemeSwitcher, {
        localVue,
        vuetify,
        propsData: {
          ...defaultProps
        }
      });
    });

    it('has correct default props', () => {
      expect(comp.vm.color).to.equal(null);
    });
  });

  describe('configured', () => {
    let comp;

    beforeEach(() => {
      comp = mount(ThemeSwitcher, {
        localVue,
        vuetify,
        propsData: {
          ...defaultProps,
          color: '#af2622'
        }
      });
    });

    it('has correct default props', () => {
      expect(comp.vm.moduleName).to.equal('wgu-toolbar');
      expect(comp.vm.icon).to.equal('dark_mode');
      expect(comp.vm.color).to.equal('#af2622');
    });
  });

  describe('theme switching', () => {
    let comp, button;

    before(() => {
      comp = mount(ThemeSwitcher, {
        localVue,
        vuetify,
        propsData: {
          ...defaultProps,
          color: '#af2622'
        }
      });

      button = comp.find('.v-btn');
    });

    it('start with light theme', () => {
      expect(comp.vm.$vuetify.theme.dark).to.equal(false);
    });

    it('switch to dark theme', async () => {
      button.trigger('click');

      await comp.vm.$nextTick();

      expect(comp.vm.$vuetify.theme.dark).to.equal(true);
    });

    it('switch back to light theme', async () => {
      button.trigger('click');

      await comp.vm.$nextTick();

      expect(comp.vm.$vuetify.theme.dark).to.equal(false);
    });
  });
});
