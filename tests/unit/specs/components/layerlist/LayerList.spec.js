import { toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { bindMap, unbindMap } from '@/composables/Map';
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

  it('has a setup hook', () => {
    expect(LayerList.setup).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(toRaw(vm.showLegends)).to.be.true;
      expect(toRaw(vm.showOpacityControls)).to.be.true;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.openedListItems).to.be.an('array').that.is.empty;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('computed properties', () => {
    let map;

    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('detects wanted layer items', () => {
      const layerIn = new VectorLayer({
        lid: 'in',
        visible: true,
        displayInLayerList: true,
        source: new VectorSource()
      });
      const layerOut = new VectorLayer({
        lid: 'out',
        visible: true,
        displayInLayerList: false,
        source: new VectorSource()
      });
      map = new OlMap({
        layers: [layerIn, layerOut]
      });
      bindMap(map);

      expect(vm.displayedLayers).to.have.lengthOf(1);
      const li = vm.displayedLayers[0];
      expect(li.toRaw()).to.equal(layerIn);
      expect(li.getVisible()).to.be.true;
    });

    it('displayedLayers items are synced with the layer stack', () => {
      const layerIn = new VectorLayer();
      const map = new OlMap({
        layers: [layerIn]
      });
      bindMap(map);

      expect(vm.displayedLayers).to.have.lengthOf(1);

      map.addLayer(new VectorLayer());

      expect(vm.displayedLayers).to.have.lengthOf(2);
    });

    afterEach(() => {
      unbindMap();
      map = undefined;

      comp.unmount();
    });
  });
});
