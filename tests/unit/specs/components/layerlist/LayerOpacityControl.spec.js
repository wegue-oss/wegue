import { shallowMount } from '@vue/test-utils';
import LayerOpacityControl from '@/components/layerlist/LayerOpacityControl';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const osmLayer = new TileLayer({
  source: new OSM()
});

const moduleProps = {
  layer: osmLayer
};

describe('layerlist/LayerOpacityControl.vue', () => {
  it('is defined', () => {
    expect(LayerOpacityControl).to.not.be.an('undefined');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerOpacityControl, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(vm.layer).to.equal(osmLayer);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerOpacityControl, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(typeof vm.onOpacitySliderInput).to.equal('function');
    });

    it('onOpacitySliderInput changes layer opacity', () => {
      expect(osmLayer.getOpacity()).to.equal(1.0);
      vm.onOpacitySliderInput(0.5);
      expect(osmLayer.getOpacity()).to.equal(0.5);
    });
  });
});
