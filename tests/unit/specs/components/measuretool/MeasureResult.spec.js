import { shallowMount } from '@vue/test-utils';
import MeasureResult from '@/components/measuretool/MeasureResult';
import PolygonGeom from 'ol/geom/Polygon'
import LineStringGeom from 'ol/geom/LineString';

describe('measuretool/MeasureResult.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof MeasureResult).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(MeasureResult);
    });

    it('has correct default props', () => {
      expect(comp.vm.measureGeom).to.equal(undefined);
      expect(comp.vm.measureType).to.equal(undefined);
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(MeasureResult);
    });

    it('has correct default data', () => {
      expect(comp.vm.area).to.equal(' -- ');
      expect(comp.vm.distance).to.equal(' -- ');
      expect(comp.vm.angle).to.equal(' -- ');
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(MeasureResult);
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(typeof vm.formatLength).to.equal('function');
      expect(typeof vm.formatArea).to.equal('function');
      expect(typeof vm.formatAngle).to.equal('function');
    });

    it('formatLength returns the correct formatted text for length', () => {
      const lineGeom = new LineStringGeom([[0, 0], [1000, 0], [1000, 1000], [0, 1000]]);
      const fLenText = vm.formatLength(lineGeom);
      expect(fLenText).to.equal('3 km');
    });

    it('formatArea returns the correct formatted text for area', () => {
      const polyGeom = new PolygonGeom([[[0, 0], [1000, 0], [1000, 1000], [0, 1000], [0, 0]]]);
      const fLenText = vm.formatArea(polyGeom);
      expect(fLenText).to.equal('1 km²');
    });

    it('formatAngle returns the correct formatted text for angle', () => {
      const lineGeom = new LineStringGeom([[0, 0], [1000, 1000]]);
      const fAngleText = vm.formatAngle(lineGeom);
      expect(fAngleText).to.equal('45.00°');
    });
  });

  describe('watchers', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(MeasureResult);
    });

    it('watches measureGeom Area', done => {
      const polyGeom = new PolygonGeom([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]);

      comp.setProps({ measureGeom: { geom: polyGeom }, measureType: 'area' });
      comp.vm.$nextTick(() => {
        expect(comp.vm.area).to.equal('1 m²');
        expect(comp.vm.distance).to.equal('4 m');
        done();
      });
    });

    it('watches measureGeom Distance', done => {
      const lineGeom = new LineStringGeom([[0, 0], [1, 0], [1, 1], [0, 1]]);

      comp.setProps({ measureGeom: { geom: lineGeom }, measureType: 'distance' });
      comp.vm.$nextTick(() => {
        expect(comp.vm.distance).to.equal('3 m');
        done();
      });
    });

    it('watches measureGeom Angle', done => {
      const lineGeom = new LineStringGeom([[0, 0], [1, 0]]);

      comp.setProps({ measureGeom: { geom: lineGeom }, measureType: 'angle' });
      comp.vm.$nextTick(() => {
        expect(comp.vm.angle).to.equal('90.00°');
        done();
      });
    });

    it('watches measureGeom non supported geom', () => {
      comp.setProps({ measureGeom: { geom: null } });
      expect(comp.vm.distance).to.equal(' -- ');
    });
  });
});
