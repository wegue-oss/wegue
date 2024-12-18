import { toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { bindMap, unbindMap } from '@/composables/Map';
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

  it('has a setup hook', () => {
    expect(typeof OverviewMapPanel.setup).to.equal('function');
  });

  it('has a mounted hook', () => {
    expect(OverviewMapPanel.mounted).to.be.a('function');
  });

  it('has an unmounted hook', () => {
    expect(typeof OverviewMapPanel.unmounted).to.equal('function');
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

  describe('computed properties', () => {
    let map;

    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('detects selected base layer', () => {
      const layerIn = new VectorLayer({
        lid: 'in',
        visible: true,
        isBaseLayer: true,
        source: new VectorSource()
      });
      const layerOut = new VectorLayer({
        lid: 'out',
        visible: true,
        isBaseLayer: false,
        source: new VectorSource()
      });
      map = new OlMap({
        layers: [layerIn, layerOut]
      });
      bindMap(map);

      expect(toRaw(vm.selectedBgLayer)).to.equal(layerIn);
    });

    it('selectedBgLayer is synced with the layer stack', async () => {
      const layerIn = new VectorLayer({
        lid: 'in',
        visible: true,
        isBaseLayer: true,
        source: new VectorSource()
      });
      const layerOut = new VectorLayer({
        lid: 'out',
        visible: true,
        isBaseLayer: true,
        source: new VectorSource()
      });
      map = new OlMap({
        layers: [layerIn]
      });
      bindMap(map);

      expect(toRaw(vm.selectedBgLayer)).to.equal(layerIn);

      layerIn.setVisible(false);
      map.addLayer(layerOut);

      expect(toRaw(vm.selectedBgLayer)).to.equal(layerOut);
    });

    afterEach(() => {
      unbindMap();
      map = undefined;

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
