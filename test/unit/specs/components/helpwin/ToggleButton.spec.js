import { mount } from '@vue/test-utils';
import HelpWinToggleBtn from '@/components/helpwin/ToggleButton';
import Vue from 'vue';

// Note: shallowMount does not work for vue test with scoped slots
// https://github.com/vuejs/vue-test-utils/issues/1261

describe('helpwin/ToggleButton.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof HelpWinToggleBtn).to.not.equal('undefined');
  });

  describe('default props', () => {
    let comp;
    beforeEach(() => {
      Vue.prototype.$appConfig = {modules: {}};
      comp = mount(HelpWinToggleBtn);
    });

    it('has correct default props', () => {
      expect(comp.vm.color).to.equal('red darken-3');
      expect(comp.vm.icon).to.equal('help');
      expect(comp.vm.text).to.equal(undefined);
      expect(comp.vm.dark).to.equal(false);
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      Vue.prototype.$appConfig = {modules: {}};
      comp = mount(HelpWinToggleBtn);
    });

    it('has correct default data', () => {
      expect(comp.vm.show).to.equal(false);
    });
  });
});
