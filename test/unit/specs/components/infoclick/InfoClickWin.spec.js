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
      expect(comp.vm.showMedia).to.equal(false);
      expect(comp.vm.mediaInfoLinkText).to.equal(undefined);
      expect(comp.vm.mediaInfoLinkUrlProp).to.equal(undefined);
      expect(comp.vm.imageProp).to.equal(undefined);
      expect(comp.vm.imageDescriptionProp).to.equal(undefined);
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(InfoClickWin);
    });

    it('has correct default data', () => {
      expect(comp.vm.attributeData).to.equal(null);
      expect(comp.vm.coordsData).to.equal(null);
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(InfoClickWin);
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(typeof vm.onMapClick).to.equal('function');
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

    it('show resets data when module is closed', () => {
      vm.map = new OlMap({});
      vm.show(true);
      vm.show(false);
      expect(vm.attributeData).to.equal(null);
      expect(vm.coordsData).to.equal(null);
    });

    it('show registers map click when module is opened', () => {
      let cnt = 0;
      let mockFn = () => {
        cnt++;
      };
      vm.registerMapClick = mockFn;

      vm.show(false);
      vm.show(true);
      expect(cnt).to.equal(1);
    });
  });
});
