import { toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import LayerPreviewImage from '@/components/bglayerswitcher/LayerPreviewImage';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';

const osmLayer = new TileLayer({
  lid: 'osm',
  source: new OSM()
});

const view = new View({
  projection: 'EPSG:3857',
  center: [0, 0],
  zoom: 2
});

const moduleProps = {
  mapView: view,
  layer: osmLayer,
  width: 152,
  height: 114,
  previewIcon: 'md:map'
};

function createWrapper (props = moduleProps) {
  return shallowMount(LayerPreviewImage, {
    props
  });
}

describe('bglayerswitcher/LayerPreviewImage.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(LayerPreviewImage).to.not.be.an('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(toRaw(vm.mapView)).to.equal(view);
      expect(toRaw(vm.layer)).to.equal(osmLayer);
      expect(vm.width).to.equal(152);
      expect(vm.height).to.equal(114);
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
      expect(vm.imgLoaded).to.be.false;
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

    it('has correct previewURL for OSM', () => {
      expect(vm.previewURL).to.equal('https://tile.openstreetmap.org/2/2/2.png');
    });

    it('has correct previewURL for static layer image', async () => {
      const osmLayer2 = new TileLayer({
        lid: 'osm2',
        source: new OSM(),
        previewImage: 'http://my-image.png'
      });

      await comp.setProps({ layer: osmLayer2 });
      expect(vm.previewURL).to.equal('http://my-image.png');
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
