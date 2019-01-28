import Vue from 'vue'
import LayerList from '@/components/layerlist/LayerList'

describe('layerlist/LayerList.vue', () => {
  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof LayerList.data).to.equal('function');
    const defaultData = LayerList.data();
    expect(defaultData.layerItems).to.be.an('array');
    expect(defaultData.layerItems.length).to.eql(0);
  });

  // Mount an instance and inspect the render output
  it('does not render on startup', () => {
    const Constructor = Vue.extend(LayerList)
    const vm = new Constructor().$mount();

    // no layers should bring up no list entries
    const layerListDomItems = vm.$el.querySelector('.wgu-layerlist-item');
    expect(layerListDomItems).to.equal(null);
  });
});
