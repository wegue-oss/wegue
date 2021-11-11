import { createLocalVue, mount } from '@vue/test-utils';
import ThemeSwitcher from '@/components/themeswitcher/ThemeSwitcher'
import Vuetify from 'vuetify'

describe('themeswitcher/ThemeSwitcher.vue', () => {
  const localVue = createLocalVue();
  let vuetify;

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
        vuetify
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
          color: '#af2622'
        }
      });
    });

    it('has correct default props', () => {
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
          color: '#af2622'
        }
      });

      button = comp.find('.v-btn');
    });

    it('start with light theme', () => {
      expect(comp.vm.$vuetify.theme.dark).to.equal(false);
    });

    it('switch to dark theme', () => {
      button.trigger('click');

      expect(comp.vm.$vuetify.theme.dark).to.equal(true);
    });

    it('switch back to light theme', () => {
      button.trigger('click');

      expect(comp.vm.$vuetify.theme.dark).to.equal(false);
    });
  });
});
