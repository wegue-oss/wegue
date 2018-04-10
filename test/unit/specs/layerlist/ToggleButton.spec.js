import Vue from 'vue'
import LayerListToggleBtn from '@/components/layerlist/ToggleButton'

describe('layerlist/ToggleButton.vue', () => {
  // Check methods
  it('has a method toggleUi', () => {
    const Constructor = Vue.extend(LayerListToggleBtn);
    const lltb = new Constructor({
    }).$mount();
    expect(typeof lltb.toggleUi).to.equal('function');
  });

  // Evaluate the results of functions
  it('sets the correct default data', () => {
    expect(typeof LayerListToggleBtn.data).to.equal('function');
    const defaultData = LayerListToggleBtn.data();
    expect(typeof defaultData).to.equal('object');
    expect(defaultData.show).to.equal(false);
  });

  // Mount an instance and inspect the render output
  it('renders the right sub-components', () => {
    const Constructor = Vue.extend(LayerListToggleBtn);
    const vm = new Constructor({
      icon: 'terrain'
    }).$mount();
    const btn = vm.$el.querySelector('v-btn');
    expect(btn !== null).to.equal(true);
    const icon = vm.$el.querySelector('v-icon');
    expect(icon !== null).to.equal(true);
  });
});
