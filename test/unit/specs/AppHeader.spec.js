import Vue from 'vue'
import AppHeader from '@/components/AppHeader'

describe('AppHeader.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof AppHeader).to.not.equal('undefined');
  });

  it('has the correct properties', () => {
    // Extend the component to get the constructor, which we can then
    // initialize directly.
    const Constructor = Vue.extend(AppHeader);
    const comp = new Constructor({
      // Props are passed in "propsData"
      propsData: {}
    }).$mount();

    expect(comp.color).to.equal('red darken-3');
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    AppHeader.$appConfig = {
      title: 'foo'
    };
    // mock some functions used in data()
    AppHeader.getModuleButtonData = () => { return [] };
    AppHeader.getToolbarButtons = () => { return [] };
    const defaultData = AppHeader.data();
    expect(defaultData.title).to.equal('foo');
    expect(defaultData.menuButtons).to.deep.equal([]);
    expect(defaultData.tbButtons).to.deep.equal([]);
  });

  // Check methods
  it('has the correct functions', () => {
    const Constructor = Vue.extend(AppHeader);
    const ah = new Constructor({
    }).$mount();
    expect(typeof ah.getModuleButtonData).to.equal('function');
    expect(typeof ah.getToolbarButtons).to.equal('function');
  });
});
