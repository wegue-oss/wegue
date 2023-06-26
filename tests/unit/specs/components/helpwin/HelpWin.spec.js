import { shallowMount } from '@vue/test-utils';
import HelpWin from '@/components/helpwin/HelpWin'
import Vue from 'vue';

const moduleProps = {
  icon: 'my-icon'
};

describe('helpwin/HelpWin.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof HelpWin).to.not.equal('undefined');
  });

  describe('unconfigured', () => {
    let comp;
    beforeEach(() => {
      Vue.prototype.$appConfig = { modules: {} };
      comp = shallowMount(HelpWin);
    });

    it('has correct default props', () => {
      expect(comp.vm.icon).to.equal('help');
    });
  });

  describe('configured', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(HelpWin, {
        propsData: moduleProps
      });
    });

    it('has correct configured and default props', () => {
      expect(comp.vm.icon).to.equal('my-icon');
    });
  });
});
