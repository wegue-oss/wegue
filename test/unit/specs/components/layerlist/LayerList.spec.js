import { shallowMount } from '@vue/test-utils';
import LayerList from '@/components/layerlist/LayerList';
import OlMap from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

describe('layerlist/LayerList.vue', () => {
  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof LayerList.data).to.equal('function');
    const defaultData = LayerList.data();
    expect(defaultData.layerItems).to.be.an('array');
    expect(defaultData.layerItems.length).to.eql(0);
    expect(defaultData.changeVisByClickUpdate).to.eql(false);
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(LayerList);
    });

    it('has correct default data', () => {
      expect(comp.vm.layerItems).to.be.an('array');
      expect(comp.vm.layerItems.length).to.eql(0);
      expect(comp.vm.changeVisByClickUpdate).to.eql(false);
    });

    describe('methods', () => {
      let comp;
      let vm;
      beforeEach(() => {
        comp = shallowMount(LayerList);
        vm = comp.vm;
      });

      it('are implemented', () => {
        expect(typeof vm.onMapBound).to.equal('function');
        expect(typeof vm.createLayerItems).to.equal('function');
        expect(typeof vm.onOlLayerVizChange).to.equal('function');
        expect(typeof vm.onItemClick).to.equal('function');
        expect(typeof vm.layerVizChanged).to.equal('function');
      });

      it('createLayerItems detects wanted layer items', () => {
        const layerIn = new VectorLayer({
          name: 'test',
          lid: 'test-lid',
          visible: true,
          displayInLayerList: true,
          source: new VectorSource()
        });
        const layerOut = new VectorLayer({
          name: 'test',
          lid: 'test-lid',
          visible: true,
          displayInLayerList: false,
          source: new VectorSource()
        });
        const map = new OlMap({
          layers: [layerIn, layerOut]
        });
        vm.map = map;
        vm.createLayerItems();

        expect(vm.layerItems.length).to.equal(1);
        const li = vm.layerItems[0];
        expect(li.title).to.equal('test');
        expect(li.lid).to.equal('test-lid');
        expect(li.visible).to.equal(true);
      });

      it('onOlLayerVizChange changes the visibility in UI and layer', () => {
        const testLid = 'test-lid';
        const layerIn = new VectorLayer({
          name: 'test',
          lid: testLid,
          visible: true,
          displayInLayerList: true,
          source: new VectorSource()
        });
        const map = new OlMap({
          layers: [layerIn]
        });
        vm.map = map;

        const evtMock = {
          target: {
            get: () => testLid
          }
        };
        vm.createLayerItems();
        vm.onOlLayerVizChange(evtMock);

        expect(vm.layerItems[0].visible).to.equal(false);
        expect(layerIn.getVisible()).to.equal(false);
      });
    });

    describe('event binding', () => {
      let comp;
      let vm;
      beforeEach(() => {
        comp = shallowMount(LayerList);
        vm = comp.vm;
      });

      it('layer items are (re)created when the layer stack changes', () => {
        const layerIn = new VectorLayer();
        const map = new OlMap({
          layers: [layerIn]
        });
        vm.map = map;
        vm.onMapBound();

        map.addLayer(new VectorLayer());

        expect(vm.layerItems.length).to.equal(2);
      });
    })
  });
});
