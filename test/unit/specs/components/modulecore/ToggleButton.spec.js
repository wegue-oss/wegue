import { shallowMount } from '@vue/test-utils';
import ToggleButton from '@/components/modulecore/ToggleButton'

const buttonProps = {
  moduleName: 'my-module',
  icon: 'my-icon'
}

describe('modulecore/ToggleButton.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(ToggleButton).to.not.be.an('undefined');
  });

  it('has a created hook', () => {
    expect(ToggleButton.created).to.be.a('function');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(ToggleButton, {
        propsData: buttonProps
      });
    });

    it('has correct default props', () => {
      expect(comp.vm.text).to.equal('');
      expect(comp.vm.dark).to.equal(false);
      expect(comp.vm.visible).to.equal(false);
    });

    it('has correct props', () => {
      expect(comp.vm.moduleName).to.equal('my-module');
      expect(comp.vm.icon).to.equal('my-icon');
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(ToggleButton, {
        propsData: buttonProps
      });
    });

    it('has correct default data', () => {
      expect(comp.vm.show).to.equal(false);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('methods', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(ToggleButton, {
        propsData: buttonProps
      });
    });

    it('toggleUi switches show', () => {
      comp.vm.show = false;
      comp.vm.toggleUi();
      expect(comp.vm.show).to.equal(true);
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
