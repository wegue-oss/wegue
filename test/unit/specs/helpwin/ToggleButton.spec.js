import Vue from 'vue'
import HelpWinToggleBtn from '@/components/helpwin/ToggleButton'

describe('helpwin/ToggleButton.vue', () => {
  // Check methods
  it('has a method toggleUi', () => {
    const Constructor = Vue.extend(HelpWinToggleBtn);
    const hwtb = new Constructor({
    }).$mount();
    expect(hwtb.icon).to.equal('help');
  });

  // Evaluate the results of functions
  it('sets the correct default data', () => {
    expect(typeof HelpWinToggleBtn.data).to.equal('function');
    const defaultData = HelpWinToggleBtn.data();
    expect(typeof defaultData).to.equal('object');
  });

  // Mount an instance and inspect the render output
  it('renders the right sub-components', () => {
    const Constructor = Vue.extend(HelpWinToggleBtn);
    const vm = new Constructor({
      icon: 'help'
    }).$mount();
    const btn = vm.$el.querySelector('v-btn');
    expect(btn !== null).to.equal(true);
  });
});
