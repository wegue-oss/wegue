import { reactive, toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import OverviewMapPanel from '@/components/overviewmap/OverviewMapPanel';
import OlMap from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const moduleProps = {
  rotateWithView: true,
  width: 164,
  height: 178
};

function createWrapper (props = moduleProps) {
  return shallowMount(OverviewMapPanel, {
    props
  });
}

describe('overviewmap/OverviewMapPanel.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(OverviewMapPanel).to.not.be.an('undefined');
  });

  it('has a mounted hook', () => {
    expect(OverviewMapPanel.mounted).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(vm.rotateWithView).to.equal(true);
      expect(vm.width).to.equal(164);
      expect(vm.height).to.equal(178);
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
      expect(typeof OverviewMapPanel.data).to.equal('function');
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

    it('detects selected base layer', () => {
      const layerIn = new VectorLayer({
        visible: true,
        isBaseLayer: true,
        source: new VectorSource()
      });
      const layerOut = new VectorLayer({
        visible: true,
        isBaseLayer: false,
        source: new VectorSource()
      });
      const map = new OlMap({
        layers: [layerIn, layerOut]
      });
      map.setLayers(reactive(map.getLayers()));
      vm.map = map;
      vm.onMapBound();

      expect(toRaw(vm.selectedBgLayer)).to.equal(layerIn);
    });

    it('selectedBgLayer is synced with the layer stack', async () => {
      const layerIn = new VectorLayer({
        visible: true,
        isBaseLayer: true,
        source: new VectorSource()
      });
      const layerOut = new VectorLayer({
        visible: true,
        isBaseLayer: true,
        source: new VectorSource()
      });
      const map = new OlMap({
        layers: [layerIn]
      });
      map.setLayers(reactive(map.getLayers()));
      vm.map = map;
      vm.onMapBound();

      expect(toRaw(vm.selectedBgLayer)).to.equal(layerIn);

      layerIn.setVisible(false);
      map.addLayer(layerOut);

      expect(toRaw(vm.selectedBgLayer)).to.equal(layerOut);
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
      expect(typeof vm.onMapUnbound).to.equal('function');
      expect(typeof vm.createOverviewMapCtrl).to.equal('function');
      expect(typeof vm.destroyOverviewMapCtrl).to.equal('function');
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
