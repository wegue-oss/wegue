import Vue from 'vue'
import AppHeader from '@/components/AppHeader'

describe('AppHeader.vue', () => {
  // Inspect the raw component options
  it('has a props object', () => {
    expect(typeof AppHeader.props).to.equal('object');
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof AppHeader.data).to.equal('function');
    const defaultData = AppHeader.data();
    expect(typeof defaultData).to.equal('object');
  });

  // Mount an instance and inspect the render output
  it('renders the correct title', () => {
    const Constructor = Vue.extend(AppHeader)
    const vm = new Constructor({
      title: 'foo'
    }).$mount();
    expect(vm.$el.querySelector('v-toolbar-title') !== null).to.equal(true);
  });
});
