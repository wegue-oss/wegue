import Vue from 'vue'
import InfoClickToggleBtn from '@/components/infoclick/ToggleButton'

describe('infoclick/ToggleButton.vue', () => {
  // Check methods
  it('has a method toggleUi', () => {
    const Constructor = Vue.extend(InfoClickToggleBtn);
    const ictb = new Constructor({
    }).$mount();
    expect(typeof ictb.toggleUi).to.equal('function');
  });

  // Evaluate the results of functions
  it('sets the correct default data', () => {
    expect(typeof InfoClickToggleBtn.data).to.equal('function');
    const defaultData = InfoClickToggleBtn.data();
    expect(typeof defaultData).to.equal('object');
    expect(defaultData.show).to.equal(false);
    expect(defaultData.icon).to.equal('info');
    expect(defaultData.text).to.equal('');
  });

  // Mount an instance and inspect the render output
  it('renders the right sub-components', () => {
    const Constructor = Vue.extend(InfoClickToggleBtn);
    const vm = new Constructor({
      icon: 'info'
    }).$mount();
    const btn = vm.$el.querySelector('v-btn');
    expect(btn !== null).to.equal(true);
    const icon = vm.$el.querySelector('v-icon');
    expect(icon !== null).to.equal(true);
  });
});
