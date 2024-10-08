import { shallowMount } from '@vue/test-utils';
import HelpWin from '@/components/helpwin/HelpWin'

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

  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof HelpWin).to.not.equal('undefined');
  });

  describe('unconfigured', () => {
    beforeEach(() => {
      comp = createWrapper();
    });

    it('has correct default props', () => {
      expect(comp.vm.icon).to.equal('md:help');
    });
  });

  describe('configured', () => {
    beforeEach(() => {
      comp = createWrapper(moduleProps);
    });

    it('has correct configured and default props', () => {
      expect(comp.vm.icon).to.equal('my-icon');
    });
  });
});
