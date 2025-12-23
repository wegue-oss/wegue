import { mount } from '@vue/test-utils';
import ThemeSwitcher from '@/components/themeswitcher/ThemeSwitcher.vue';

const defaultProps = {
  icon: 'md:dark_mode'
}

function createWrapper (props = defaultProps) {
  return mount(ThemeSwitcher, {
    props
  });
}

describe('themeswitcher/ThemeSwitcher.vue', () => {
  let comp;
  let vm;
  let button;

  // Inspect the raw component options
  it('is defined', () => {
    expect(ThemeSwitcher).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(ThemeSwitcher.setup).to.be.a('function');
  });

  describe('theme switching', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
      button = comp.find('.v-btn');
    });

    it('start with light theme', () => {
      expect(vm.theme.global.name.value).to.equal('light');
    });

    it('switch to dark theme', async () => {
      await button.trigger('click');

      expect(vm.theme.global.name.value).to.equal('dark');
    });

    it('switch back to light theme', async () => {
      expect(vm.theme.global.name.value).to.equal('light');

      await button.trigger('click');

      expect(vm.theme.global.name.value).to.equal('dark');

      await button.trigger('click');

      expect(vm.theme.global.name.value).to.equal('light');
    });

    afterEach(() => {
      comp.vm.theme.change('light');
      comp.unmount();
    });
  });
});
