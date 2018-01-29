import Vue from 'vue'
import HelpWin from '@/components/helpwin/HelpWin'

describe('HelpWin.vue', () => {
  // Inspect the raw component options
  it('has a created hook', () => {
    expect(typeof HelpWin.created).to.equal('function');
  });

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
    expect(vm.$el.textContent).to.equal('');
  });
});
