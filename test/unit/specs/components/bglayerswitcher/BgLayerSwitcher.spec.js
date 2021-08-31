import { mount, shallowMount } from '@vue/test-utils';
import BgLayerSwitcher from '@/components/bglayerswitcher/BgLayerSwitcher';
import OlMap from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

describe('bglayerswitcher/BgLayerSwitcher.vue', () => {
  it('is defined', () => {
    expect(BgLayerSwitcher).to.not.be.an('undefined');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(BgLayerSwitcher);
      vm = comp.vm
    });

    it('has correct default props', () => {
      expect(vm.color).to.equal('red darken-3');
      expect(vm.icon).to.equal('map');
      expect(vm.dark).to.equal(true);
      expect(vm.imageWidth).to.equal(152);
      expect(vm.imageHeight).to.equal(114);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(BgLayerSwitcher);
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.open).to.equal(false);
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
      comp = shallowMount(BgLayerSwitcher);
      vm = comp.vm;
    });

    it('only visible when more than one layer', () => {
      const layerIn = new VectorLayer({
        visible: true,
        isBaseLayer: true,
        source: new VectorSource()
      });
      const layerOut = new VectorLayer({
        visible: false,
        isBaseLayer: true,
        source: new VectorSource()
      });
      const map = new OlMap({
        layers: [layerIn]
      });
      vm.map = map;
      vm.onMapBound();

      expect(vm.show).to.equal(false);

      map.addLayer(layerOut);

      expect(vm.show).to.equal(true);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('user interactions', () => {
    let comp;
    let vm;

    // Remarks: The following is necessary to avoid warnings.
    //  For reasons not fully understood the test utils will fail to attach
    //  the v-menu to the wgu-bglayerswitcher-wrapper div element created
    //  in the component.
    const div = document.createElement('div');
    div.id = 'wgu-bglayerswitcher-wrapper';
    document.body.appendChild(div);

    beforeEach(() => {
      comp = mount(BgLayerSwitcher, {
        created () {
          this.$vuetify.theme = { dark: false };
        },
        computed: {
          show () {
            return true;
          }
        }
      });
      vm = comp.vm;
    });

    it('button click switches open', done => {
      expect(vm.open).to.equal(false);

      const button = comp.findComponent({ name: 'v-btn' });
      button.trigger('click');

      vm.$nextTick(() => {
        expect(vm.open).to.equal(true);
        done();
      });
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
