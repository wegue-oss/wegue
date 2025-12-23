import { shallowMount } from '@vue/test-utils';
import HelpWin from '@/components/helpwin/HelpWin.vue';

const moduleProps = {
  icon: 'my-icon'
};

function createWrapper (props = {}, $appConfig = { modules: {} }) {
  return shallowMount(HelpWin, {
    props,
    global: {
      mocks: {
        $appConfig
      }
    }
  });
}

describe('helpwin/HelpWin.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(HelpWin).to.not.be.an('undefined');
  });

  describe('unconfigured', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('md:help');
      expect(vm.width).to.equal(300);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('configured', () => {
    beforeEach(() => {
      comp = createWrapper(moduleProps);
      vm = comp.vm;
    });

    it('has correct props', () => {
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

    afterEach(() => {
      comp.unmount();
    });
  });
});
