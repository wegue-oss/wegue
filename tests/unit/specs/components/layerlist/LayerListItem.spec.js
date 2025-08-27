import { toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import LayerListItem from '@/components/layerlist/LayerListItem';
import { LayerProxy } from '@/util/Layer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';

const osmLayer = new LayerProxy(
  new TileLayer({
    lid: 'osm',
    source: new OSM()
  })
);

const view = new View({
  projection: 'EPSG:3857',
  center: [0, 0],
  zoom: 2
});

const moduleProps = {
  mapView: view,
  layer: osmLayer,
  showLegends: true,
  showOpacityControls: true,
  openedListItems: []
};

function createWrapper (props = moduleProps) {
  return shallowMount(LayerListItem, {
    props
  });
}

describe('layerlist/LayerListItem.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(LayerListItem).to.not.be.an('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(toRaw(vm.mapView)).to.equal(view);
      expect(toRaw(vm.layer)).to.equal(osmLayer);
      expect(vm.showLegends).to.be.true;
      expect(vm.showOpacityControls).to.be.true;
      expect(vm.openedListItems).to.be.an('array').that.has.lengthOf(0);
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
      expect(vm.open).to.be.false;
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
      expect(vm.onItemClick).to.be.a('function');
    });

    it('onItemClick toggles layer visibility', () => {
      expect(osmLayer.getVisible()).to.be.true;

      vm.onItemClick();

      expect(osmLayer.getVisible()).to.be.false;
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

    it('has correct showLegend property for layer', async () => {
      expect(vm.showLegend).to.be.false;

      const osmLayer2 = new LayerProxy(
        new TileLayer({
          lid: 'osm2',
          source: new OSM(),
          legend: true
        })
      );
      await comp.setProps({ layer: osmLayer2 });

      expect(vm.showLegend).to.be.true;
    });

    it('has correct showOpacityControl property for layer', async () => {
      expect(vm.showOpacityControl).to.be.false;

      const osmLayer2 = new LayerProxy(
        new TileLayer({
          lid: 'osm2',
          source: new OSM(),
          opacityControl: true
        })
      );
      await comp.setProps({ layer: osmLayer2 });

      expect(vm.showOpacityControl).to.be.true;
    });

    it('has correct showDetails property for layer', async () => {
      expect(vm.showDetails).to.be.false;

      const osmLayer2 = new LayerProxy(
        new TileLayer({
          lid: 'osm2',
          source: new OSM(),
          legend: true
        })
      );
      await comp.setProps({ layer: osmLayer2 });

      expect(vm.showDetails).to.be.true;

      const osmLayer3 = new LayerProxy(
        new TileLayer({
          lid: 'osm3',
          source: new OSM(),
          opacityControl: true
        })
      );
      comp.setProps({ layer: osmLayer3 });

      expect(vm.showDetails).to.be.true;
    });

    it('has correct layerLid property for layer', async () => {
      expect(vm.layerLid).to.equal('osm');

      const osmLayer2 = new LayerProxy(
        new TileLayer({
          lid: 'osm2',
          source: new OSM(),
          legend: true
        })
      );
      await comp.setProps({ layer: osmLayer2 });

      expect(vm.layerLid).to.equal('osm2');
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
