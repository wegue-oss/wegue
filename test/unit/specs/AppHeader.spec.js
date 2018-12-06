import Vue from 'vue'
import AppHeader from '@/components/AppHeader'

describe('AppHeader.vue', () => {
  //
  it('has a method toggleUi', () => {
    const Constructor = Vue.extend(AppHeader);
    const ah = new Constructor({
    }).$mount();
    expect(typeof ah.getModuleButtonData).to.equal('function');
    expect(typeof ah.getToolbarButtons).to.equal('function');
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    AppHeader.$appConfig = {
      title: 'foo'
    };
    expect(typeof AppHeader.data).to.equal('function');
  });

  // Mount an instance and inspect the render output
  it('renders the correct title', () => {
    AppHeader.$appConfig = {
      title: 'foo'
    };
    const Constructor = Vue.extend(AppHeader);
    const vm = new Constructor({
      title: 'foo'
    }).$mount();

    expect(vm.$el.querySelector('v-toolbar-title') !== null).to.equal(true);
  });
});
