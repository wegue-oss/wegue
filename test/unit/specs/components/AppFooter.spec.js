import Vue from 'vue'
import { shallowMount } from '@vue/test-utils';
import AppFooter from 'APP/components/AppFooter'

describe('AppFooter.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof AppFooter).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      Vue.prototype.$appConfig = {modules: {}};
      comp = shallowMount(AppFooter);
    });

    it('has correct default props', () => {
      expect(comp.vm.color).to.equal('red darken-3');
      expect(comp.vm.footerTextLeft).to.equal('Powered by <a href="https://meggsimum.de/wegue/" target="_blank">Wegue WebGIS</a>');
      expect(comp.vm.footerTextRight).to.equal('meggsimum');
      expect(comp.vm.showCopyrightYear).to.equal(true);
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
