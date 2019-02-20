import Vue from 'vue'
import AppFooter from '@/components/AppFooter'

describe('AppFooter.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof AppFooter).to.not.equal('undefined');
  });

  it('has the correct properties', () => {
    // Extend the component to get the constructor, which we can then
    // initialize directly.
    const Constructor = Vue.extend(AppFooter);
    const comp = new Constructor({
      // Props are passed in "propsData"
      propsData: {}
    }).$mount();

    expect(comp.color).to.equal('red darken-3');
    expect(comp.footerTextLeft).to.equal('Powered by <a href="https://meggsimum.de/wegue/" target="_blank">Wegue WebGIS</a>');
    expect(comp.footerTextRight).to.equal('meggsimum');
    expect(comp.showCopyrightYear).to.equal(true);
  });
});
