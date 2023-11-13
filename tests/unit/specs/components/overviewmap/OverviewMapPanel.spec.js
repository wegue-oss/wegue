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

describe('overviewmap/OverviewMapPanel.vue', () => {
  it('is defined', () => {
    expect(OverviewMapPanel).to.not.be.an('undefined');
  });

  it('has a mounted hook', () => {
    expect(OverviewMapPanel.mounted).to.be.a('function');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(OverviewMapPanel, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(vm.rotateWithView).to.equal(true);
      expect(vm.width).to.equal(164);
      expect(vm.height).to.equal(178);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(OverviewMapPanel, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(typeof OverviewMapPanel.data).to.equal('function');
      expect(vm.layers).to.be.an('array');
      expect(vm.layers.length).to.eql(0);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('computed properties', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(OverviewMapPanel, {
        propsData: moduleProps
      });
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
      vm.map = map;
      vm.onMapBound();

      expect(vm.selectedBgLayer).to.equal(layerIn);
    });

    it('selectedBgLayer is synced with the layer stack', () => {
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
      vm.map = map;
      vm.onMapBound();

      expect(vm.selectedBgLayer).to.equal(layerIn);

      layerIn.setVisible(false);
      map.addLayer(layerOut);

      expect(vm.selectedBgLayer).to.equal(layerOut);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(OverviewMapPanel, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(typeof vm.onMapBound).to.equal('function');
      expect(typeof vm.onMapUnbound).to.equal('function');
      expect(typeof vm.createOverviewMapCtrl).to.equal('function');
      expect(typeof vm.destroyOverviewMapCtrl).to.equal('function');
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
