import Vue from 'vue'
import { shallowMount } from '@vue/test-utils';
import AppFooter from 'APP/components/AppFooter'

const footerProps = {
  footerTextLeft: 'my-text-left',
  footerTextRight: 'my-text-right'
}

describe('AppFooter.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof AppFooter).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      Vue.prototype.$appConfig = {modules: {}};
      comp = shallowMount(AppFooter, {
        propsData: footerProps
      });
    });

    it('has correct default props', () => {
      expect(comp.vm.color).to.equal('red darken-3');
      expect(comp.vm.showCopyrightYear).to.equal(true);
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
