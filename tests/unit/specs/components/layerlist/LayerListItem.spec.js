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
  mapView: view,
  layer: osmLayer,
  showLegends: true,
  showOpacityControls: true
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
      expect(vm.showLegends).to.equal(true);
      expect(vm.showOpacityControls).to.equal(true);
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
      vm.onItemClick();
      expect(osmLayer.getVisible()).to.equal(false);
    });
  });

  describe('computed properties', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerListItem, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct showLegend property for layer', async () => {
      expect(vm.showLegend).to.equal(false);

      const osmLayer2 = new TileLayer({
        source: new OSM(),
        legend: true
      });
      await comp.setProps({ layer: osmLayer2 });
      expect(vm.showLegend).to.equal(true);
    });

    it('has correct showOpacityControl property for layer', async () => {
      expect(vm.showOpacityControl).to.equal(false);

      const osmLayer2 = new TileLayer({
        source: new OSM(),
        opacityControl: true
      });
      await comp.setProps({ layer: osmLayer2 });
      expect(vm.showOpacityControl).to.equal(true);
    });

    it('has correct showDetails property for layer', async () => {
      expect(vm.showDetails).to.equal(false);

      const osmLayer2 = new TileLayer({
        source: new OSM(),
        legend: true
      });
      await comp.setProps({ layer: osmLayer2 });
      expect(vm.showDetails).to.equal(true);

      const osmLayer3 = new TileLayer({
        source: new OSM(),
        opacityControl: true
      });
      comp.setProps({ layer: osmLayer3 });
      expect(vm.showDetails).to.equal(true);
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
