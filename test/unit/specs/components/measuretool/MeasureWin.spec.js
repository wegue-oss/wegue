import { mount } from '@vue/test-utils';
import MeasureWin from '@/components/measuretool/MeasureWin';
import OlMap from 'ol/Map';
import LineStringGeom from 'ol/geom/LineString';

describe('measuretool/MeasureWin.vue', () => {
  it('is defined', () => {
    expect(typeof MeasureWin).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = mount(MeasureWin);
    });

    it('has correct default props', () => {
      expect(comp.vm.icon).to.equal('photo_size_select_small');
      expect(comp.vm.title).to.equal('Measure');
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = mount(MeasureWin);
    });

    it('has correct default data', () => {
      expect(comp.vm.moduleName).to.equal('wgu-measuretool');
      expect(comp.vm.measureGeom).to.equal(null);
      expect(comp.vm.measureType).to.equal('distance');
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('watchers - measureType', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = mount(MeasureWin);
      vm = comp.vm;
    });

    it('watches measureType resets old data', done => {
      vm.map = new OlMap({});
      vm.onMapBound();
      vm.measureType = 'area';
      vm.$nextTick(() => {
        expect(vm.measureGeom).to.be.an('object').that.is.empty;
        done();
      })
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = mount(MeasureWin);
      vm = comp.vm;
    });

    it('show resets map interaction when module is closed', () => {
      let cnt = 0;
      let mockFn = () => {
        cnt++;
      };

      vm.map = new OlMap({});
      vm.onMapBound();
      vm.olMapCtrl.removeInteraction = mockFn;

      vm.show(true);
      vm.show(false);
      expect(cnt).to.equal(1);
    });

    it('show registers map interaction when module is opened', () => {
      let cnt = 0;
      let mockFn = () => {
        cnt++;
      };
      vm.map = new OlMap({});
      vm.onMapBound();
      vm.olMapCtrl.addInteraction = mockFn;

      vm.show(false);
      vm.show(true);
      expect(cnt).to.equal(1);
    });

    it('are implemented', () => {
      expect(typeof vm.applyMeasureType).to.equal('function');
      expect(typeof vm.onMeasureVertexSet).to.equal('function');
    });

    it('applyMeasureType sets measureType', () => {
      vm.applyMeasureType('kalle');
      expect(vm.measureType).to.equal('kalle');
    });

    it('onMeasureVertexSet sets measureGeom object', () => {
      const lineGeom = new LineStringGeom([[0, 0], [1000, 0], [1000, 1000], [0, 1000]]);
      vm.onMeasureVertexSet(lineGeom);
      expect(vm.measureGeom.geom).to.equal(lineGeom);
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
