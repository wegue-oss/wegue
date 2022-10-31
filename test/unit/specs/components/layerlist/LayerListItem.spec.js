import { shallowMount } from '@vue/test-utils';
import LayerListItem from '@/components/layerlist/LayerListItem';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';

const osmLayer = new TileLayer({
  source: new OSM()
});

const view = new View({
  projection: 'EPSG:3857',
  center: [0, 0],
  zoom: 2
});

const moduleProps = {
  'mapView': view,
  'layer': osmLayer,
  'showDetails': true
};

describe('layerlist/LayerListItem.vue', () => {
  it('is defined', () => {
    expect(LayerListItem).to.not.be.an('undefined');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerListItem, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(vm.mapView).to.equal(view);
      expect(vm.layer).to.equal(osmLayer);
      expect(vm.showDetails).to.equal(true)
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerListItem, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.open).to.equal(false);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerListItem, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(typeof vm.onItemClick).to.equal('function');
    });

    it('onItemClick toggles layer visibility', () => {
      expect(osmLayer.getVisible()).to.equal(true);
      vm.onItemClick(osmLayer);
      expect(osmLayer.getVisible()).to.equal(false);
    });
  });
});
