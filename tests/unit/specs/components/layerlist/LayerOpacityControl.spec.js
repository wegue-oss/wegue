import { shallowMount } from '@vue/test-utils';
import LayerOpacityControl from '@/components/layerlist/LayerOpacityControl';
import { LayerProxy } from '@/util/Layer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const osmLayer = new LayerProxy(
  new TileLayer({
    lid: 'osm',
    source: new OSM()
  })
)

const moduleProps = {
  layer: osmLayer
};

function createWrapper (props = moduleProps) {
  return shallowMount(LayerOpacityControl, {
    props
  });
}

describe('layerlist/LayerOpacityControl.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(LayerOpacityControl).to.not.be.an('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(vm.layer).to.equal(osmLayer);
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
      expect(vm.onOpacitySliderInput).to.be.a('function');
    });

    it('onOpacitySliderInput changes layer opacity', () => {
      expect(osmLayer.getOpacity()).to.equal(1.0);

      vm.onOpacitySliderInput(0.5);

      expect(osmLayer.getOpacity()).to.equal(0.5);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
