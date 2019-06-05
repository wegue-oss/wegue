// import Vue from 'vue'
import { shallowMount } from '@vue/test-utils';
import InfoClickWin from '@/components/infoclick/InfoClickWin';
import OlMap from 'ol/Map';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Point from 'ol/geom/Point'

describe('infoclick/InfoClickWin.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof InfoClickWin).to.not.equal('undefined');
  });

  it('has a created hook', () => {
    expect(typeof InfoClickWin.created).to.equal('function');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(InfoClickWin);
    });

    it('has correct default props', () => {
      expect(comp.vm.color).to.equal('red darken-3');
      expect(comp.vm.icon).to.equal('info');
      expect(comp.vm.title).to.equal('Map Click Info');
      expect(comp.vm.draggable).to.equal(true);
      expect(comp.vm.initPos).to.equal(undefined);
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(InfoClickWin);
    });

    it('has correct default data', () => {
      expect(comp.vm.show).to.equal(false);
      expect(comp.vm.left).to.equal('0');
      expect(comp.vm.top).to.equal('0');
      expect(comp.vm.attributeData).to.equal(null);
      expect(comp.vm.coordsData).to.equal(null);

      comp.setProps({ initPos: {left: 8, top: 88} });
      expect(comp.vm.left).to.equal('0');
      expect(comp.vm.top).to.equal('0');
    });

    // it('has correct default initPos data', () => {
    //   comp.setProps({ initPos: {left: 8, top: 88} });
    //   expect(comp.vm.left).to.equal('8px');
    //   expect(comp.vm.top).to.equal('88px');
    // });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(InfoClickWin);
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(typeof vm.toggleUi).to.equal('function');
      expect(typeof vm.onMapClick).to.equal('function');
    });

    it('toggleUi switches show', () => {
      vm.toggleUi();
      expect(vm.show).to.equal(true);
    });

    it('onMapClick sets correct data if no feature found', () => {
      const mockEvt = {
        pixel: [0, 0],
        coordinate: [8, 8]
      };
      const map = new OlMap();
      vm.map = map;
      vm.onMapClick(mockEvt);
      expect(vm.attributeData).to.equal(null);
      expect(vm.coordsData.coordinate).to.equal(mockEvt.coordinate);
      expect(vm.coordsData.projection).to.equal('EPSG:3857');
    });

    it('onMapClick sets correct data if no we have features found', () => {
      const mockEvt = {
        pixel: [0, 0],
        coordinate: [0, 0]
      };
      const feat = new Feature({
        geometry: new Point(mockEvt.coordinate),
        foo: 'bar'
      });
      const layer = new VectorLayer({
        source: new VectorSource({
          features: [feat]
        })
      });
      const map = new OlMap({
        layers: [layer]
      });
      map.forEachFeatureAtPixel = () => {
        return [feat, layer];
      };
      vm.map = map;
      vm.onMapClick(mockEvt);
      expect(vm.attributeData.foo).to.equal('bar');
      expect(vm.coordsData.coordinate).to.equal(mockEvt.coordinate);
      expect(vm.coordsData.projection).to.equal('EPSG:3857');
    });
  });

  describe('watchers', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(InfoClickWin);
    });

    it('watches show setting to false', () => {
      comp.vm.show = true;
      comp.vm.show = false;
      expect(comp.vm.attributeData).to.equal(null);
      expect(comp.vm.coordsData).to.equal(null);
    });

    it('watches show setting to true', () => {
      let cnt = 0;
      let mockFn = () => {
        cnt++;
      };
      comp.vm.registerMapClick = mockFn;
      comp.vm.show = true;
      expect(cnt).to.equal(1);
    });
  });
});
