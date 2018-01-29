import Vue from 'vue'
import HelpWinToggleBtn from '@/components/helpwin/ToggleButton'

describe('helpwin/ToggleButton.vue', () => {
  // Check methods
  it('has a method toggleUi', () => {
    const hwtb = new HelpWinToggleBtn();
    expect(typeof hwtb.toggleUi).to.equal('function');
  });

  // Evaluate the results of functions
  it('sets the correct default data', () => {
    const hwtb = new HelpWinToggleBtn();
    hwtb.toggleUi();
    expect(hwtb.showUi).to.equal(true);
  });

  // Mount an instance and inspect the render output
  it('renders the right sub-components', () => {
    const Constructor = Vue.extend(HelpWinToggleBtn);
    const vm = new Constructor({
      icon: 'help'
    }).$mount();
    const btn = vm.$el.querySelector('v-btn');
    expect(btn !== null).to.equal(true);
    const icon = vm.$el.querySelector('v-icon');
    expect(icon !== null).to.equal(true);
  });
});
