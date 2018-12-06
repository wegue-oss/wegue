import Vue from 'vue'
import HelpWin from '@/components/helpwin/HelpWin'

describe('helpwin/HelpWin.vue', () => {
  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof HelpWin.data).to.equal('function');
    const defaultData = HelpWin.data();
    expect(defaultData.show).to.equal(false);
  });

  // Mount an instance and inspect the render output
  it('does not render on startup', () => {
    const Constructor = Vue.extend(HelpWin)
    const vm = new Constructor().$mount();
    // el is not undefined but this tests that it is not rendered
    expect(vm.$el.textContent).to.equal('help About  close About Wegue WebGIS with OpenLayers and Vue.js Template and re-usable components for webmapping applications with OpenLayers and Vue.js More info');
  });
});
