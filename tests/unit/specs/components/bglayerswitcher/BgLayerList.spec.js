import { shallowMount } from '@vue/test-utils';
import { bindMap, unbindMap } from '@/composables/Map';
import BgLayerList from '@/components/bglayerswitcher/BgLayerList.vue';
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
  let map;

  it('is defined', () => {
    expect(BgLayerList).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(BgLayerList.setup).to.be.a('function');
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
      map = new OlMap({
        layers: [layerIn, layerOut]
      });
      bindMap(map);

      expect(vm.displayedLayers).to.have.lengthOf(1);
      const li = vm.displayedLayers[0];
      expect(li.toRaw()).to.equal(layerIn);
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
      bindMap(map);

      expect(vm.displayedLayers).to.have.lengthOf(1);

      map.addLayer(layerOut);

      expect(vm.displayedLayers).to.have.lengthOf(2);
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
      expect(vm.onSelectLayer).to.be.a('function');
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
      map = new OlMap({
        layers: [layerIn, layerOut]
      });
      bindMap(map);

      expect(layerIn.getVisible()).to.be.true;
      expect(layerOut.getVisible()).to.be.false;
      expect(vm.selectedLid).to.equal(layerIn.get('lid'));

      vm.onSelectLayer(layerOut.get('lid'));

      expect(layerIn.getVisible()).to.be.false;
      expect(layerOut.getVisible()).to.be.true;
      expect(vm.selectedLid).to.equal(layerOut.get('lid'));
    });

    afterEach(() => {
      unbindMap();
      map = undefined;

      comp.unmount();
    });
  });
});
