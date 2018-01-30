import Vue from 'vue'
import ToggleUiButton from '@/components/ToggleUiButton'

describe('ToggleUiButton.vue', () => {
  // Evaluate the results of functions
  it('sets the correct default data', () => {
    const tuib = new ToggleUiButton();
    expect(tuib.showUi).to.equal(false);
  });

  // Mount an instance and inspect the render output
  it('renders the right sub-components', () => {
    const Constructor = Vue.extend(ToggleUiButton);
    const vm = new Constructor({}).$mount();
    const btn = vm.$el.querySelector('v-btn');
    expect(btn !== null).to.equal(true);
    const icon = vm.$el.querySelector('v-icon');
    expect(icon !== null).to.equal(true);
  });
});
