import { shallowMount } from '@vue/test-utils';
import ToggleButton from '@/components/modulecore/ToggleButton';

const buttonProps = {
  moduleName: 'my-module',
  icon: 'my-icon'
};

function createWrapper (props = buttonProps) {
  return shallowMount(ToggleButton, {
    props
  });
}

describe('modulecore/ToggleButton.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(ToggleButton).to.not.be.an('undefined');
  });

  it('has a created hook', () => {
    expect(ToggleButton.created).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.visible).to.equal(false);
    });

    it('has correct props', () => {
      expect(vm.moduleName).to.equal('my-module');
      expect(vm.icon).to.equal('my-icon');
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.show).to.equal(false);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('toggleUi switches show', () => {
      vm.show = false;
      vm.toggleUi();
      expect(vm.show).to.equal(true);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
