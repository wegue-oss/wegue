import { reactive, toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import LayerList from '@/components/layerlist/LayerList';
import OlMap from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const moduleProps = {
  showLegends: true,
  showOpacityControls: true
};

function createWrapper (props = moduleProps) {
  return shallowMount(LayerList, {
    props
  });
}

describe('layerlist/LayerList.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(LayerList).to.not.be.an('undefined');
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(typeof LayerList.data).to.equal('function');
      expect(vm.layers).to.be.an('array');
      expect(vm.layers.length).to.eql(0);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('computed properties', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('detects wanted layer items', () => {
      const layerIn = new VectorLayer({
        visible: true,
        displayInLayerList: true,
        source: new VectorSource()
      });
      const layerOut = new VectorLayer({
        visible: true,
        displayInLayerList: false,
        source: new VectorSource()
      });
      const map = new OlMap({
        layers: [layerIn, layerOut]
      });
      map.setLayers(reactive(map.getLayers()))
      vm.map = map;
      vm.onMapBound();

      expect(vm.displayedLayers.length).to.equal(1);
      const li = vm.displayedLayers[0];
      expect(toRaw(li)).to.equal(layerIn);
      expect(li.getVisible()).to.equal(true);
    });

    it('displayedLayers items are synced with the layer stack', () => {
      const layerIn = new VectorLayer();
      const map = new OlMap({
        layers: [layerIn]
      });
      map.setLayers(reactive(map.getLayers()));
      vm.map = map;
      vm.onMapBound();

      expect(vm.displayedLayers.length).to.equal(1);

      map.addLayer(new VectorLayer());

      expect(vm.displayedLayers.length).to.equal(2);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(typeof vm.onMapBound).to.equal('function');
    });
  });
});
