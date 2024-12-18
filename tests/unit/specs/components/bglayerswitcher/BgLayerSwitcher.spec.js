import { nextTick } from 'vue';
import { mount, shallowMount } from '@vue/test-utils';
import { bindMap, unbindMap } from '@/composables/Map';
import BgLayerSwitcher from '@/components/bglayerswitcher/BgLayerSwitcher';
import OlMap from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

function createWrapper (stubChildrenComponents = true) {
  if (stubChildrenComponents) {
    return shallowMount(BgLayerSwitcher);
  } else {
    return mount(BgLayerSwitcher);
  }
}

describe('bglayerswitcher/BgLayerSwitcher.vue', () => {
  let comp;
  let vm;
  let map;

  it('is defined', () => {
    expect(BgLayerSwitcher).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(BgLayerSwitcher.setup).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('md:map');
      expect(vm.imageWidth).to.equal(152);
      expect(vm.imageHeight).to.equal(114);
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
      expect(vm.open).to.equal(false);
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

    it('only visible when more than one layer', () => {
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
        layers: [layerIn]
      });
      bindMap(map);

      expect(vm.show).to.equal(false);

      map.addLayer(layerOut);

      expect(vm.show).to.equal(true);
    });

    afterEach(() => {
      unbindMap();
      map = undefined;
      comp.unmount();
    });
  });

  describe('user interactions', () => {
    let divElement;

    beforeEach(() => {
      // Remarks: The following is necessary to avoid warnings.
      //  For reasons not fully understood the test utils will fail to attach
      //  the v-menu to the wgu-bglayerswitcher-wrapper div element created
      //  in the component.
      divElement = document.createElement('div');
      divElement.id = 'wgu-bglayerswitcher-wrapper';
      document.body.appendChild(divElement);

      comp = createWrapper(false);
      vm = comp.vm;
    });

    it('button click switches open', async () => {
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
      await nextTick();

      expect(vm.open).to.equal(false);

      const button = comp.findComponent({ name: 'v-btn' });
      await button.trigger('click');

      expect(vm.open).to.equal(true);
    });

    afterEach(() => {
      unbindMap();
      map = undefined;
      comp.unmount();

      if (divElement) {
        divElement.remove();
        divElement = undefined;
      }
    });
  });
});
