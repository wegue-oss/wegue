// import { reactive, toRaw } from 'vue';
import { toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import BgLayerList from '@/components/bglayerswitcher/BgLayerList';
import OlMap from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const moduleProps = {
  imageWidth: 152,
  imageHeight: 114,
  previewIcon: 'md:map'
};

function createWrapper (props = moduleProps) {
  return shallowMount(BgLayerList, {
    props
  });
}

describe('bglayerswitcher/BgLayerList.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(BgLayerList).to.not.be.an('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(vm.imageWidth).to.equal(152);
      expect(vm.imageHeight).to.equal(114);
      expect(vm.previewIcon).to.equal('md:map');
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
      expect(typeof BgLayerList.data).to.equal('function');
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

    it('detects base layer items', () => {
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
      const map = new OlMap({
        layers: [layerIn, layerOut]
      });
      // map.setLayers(reactive(map.getLayers()))
      vm.map = map;
      vm.onMapBound();

      expect(vm.displayedLayers.length).to.equal(1);
      const li = vm.displayedLayers[0];
      expect(toRaw(li)).to.equal(layerIn);
      expect(li.getVisible()).to.equal(true);
      expect(vm.selectedLid).to.equal(layerIn.get('lid'));
    });

    it('displayedLayers items are synced with the layer stack', () => {
      const layerIn = new VectorLayer({
        lid: 'in',
        visible: true,
        isBaseLayer: true,
        source: new VectorSource()
      });
      const layerOut = new VectorLayer({
        lid: 'out',
        visible: false,
        isBaseLayer: true,
        source: new VectorSource()
      });
      const map = new OlMap({
        layers: [layerIn]
      });
      // map.setLayers(reactive(map.getLayers()))
      vm.map = map;
      vm.onMapBound();

      expect(vm.displayedLayers.length).to.equal(1);

      map.addLayer(layerOut);

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
      expect(typeof vm.onSelectLayer).to.equal('function');
    });

    it('onSelectLayer toggles layer visibility and selection', () => {
      const layerIn = new VectorLayer({
        lid: 'in',
        visible: true,
        isBaseLayer: true,
        source: new VectorSource()
      });
      const layerOut = new VectorLayer({
        lid: 'out',
        visible: false,
        isBaseLayer: true,
        source: new VectorSource()
      });
      const map = new OlMap({
        layers: [layerIn, layerOut]
      });
      // map.setLayers(reactive(map.getLayers()))
      vm.map = map;
      vm.onMapBound();

      expect(layerIn.getVisible()).to.equal(true);
      expect(layerOut.getVisible()).to.equal(false);
      expect(vm.selectedLid).to.equal(layerIn.get('lid'));

      vm.onSelectLayer(layerOut.get('lid'));

      expect(layerIn.getVisible()).to.equal(false);
      expect(layerOut.getVisible()).to.equal(true);
      expect(vm.selectedLid).to.equal(layerOut.get('lid'));
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
