import Vue from 'vue'
import LayerListWin from '@/components/layerlist/LayerListWin'

describe('layerlist/LayerListWin.vue', () => {
  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof LayerListWin.data).to.equal('function');
    const defaultData = LayerListWin.data();
    expect(defaultData.show).to.equal(false);
    expect(defaultData.left).to.equal('10px');
    expect(defaultData.top).to.equal('70px');
  });

  // Mount an instance and inspect the render output
  it('does not render on startup', () => {
    const Constructor = Vue.extend(LayerListWin);
    const vm = new Constructor().$mount();

    // el is not undefined but this tests that it is not rendered
    expect(vm.$el.textContent).to.equal('');
  });
});
