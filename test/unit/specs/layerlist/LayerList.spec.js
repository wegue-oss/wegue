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
    expect(defaultData.changeVisByClickUpdate).to.eql(false);
  });

  it('has the correct functions', () => {
    const Constructor = Vue.extend(LayerList);
    const vm = new Constructor().$mount();
    expect(typeof vm.onMapBound).to.equal('function');
    expect(typeof vm.createLayerItems).to.equal('function');
    expect(typeof vm.onOlLayerVizChange).to.equal('function');
    expect(typeof vm.onItemClick).to.equal('function');
    expect(typeof vm.layerVizChanged).to.equal('function');
  });
});
