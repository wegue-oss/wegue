import Vue from 'vue'
import LayerListWin from '@/components/layerlist/LayerListWin'

describe('layerlist/LayerListWin.vue', () => {
  it('has the correct properties', () => {
    // Extend the component to get the constructor, which we can then
    // initialize directly.
    const Constructor = Vue.extend(LayerListWin);
    const comp = new Constructor({
      // Props are passed in "propsData"
      propsData: {}
    }).$mount();

    expect(comp.icon).to.equal('layers');
    expect(comp.title).to.equal('Layers');
  });

  // Mount an instance and inspect the render output
  it('does not render on startup', () => {
    const Constructor = Vue.extend(LayerListWin);
    const vm = new Constructor().$mount();

    // el is not undefined but this tests that it is not rendered
    expect(vm.$el.textContent).to.equal('');
  });
});
