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
  });

  describe('watchers', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(MeasureResult);
    });

    it('watches measureGeom Polygon', done => {
      const polyGeom = new PolygonGeom([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]);

      comp.setProps({measureGeom: {geom: polyGeom}});
      comp.vm.$nextTick(() => {
        expect(comp.vm.area).to.equal('1 m²');
        done();
      });
    });

    it('watches measureGeom LineString', done => {
      const lineGeom = new LineStringGeom([[0, 0], [1, 0], [1, 1], [0, 1]]);

      comp.setProps({measureGeom: {geom: lineGeom}});
      comp.vm.$nextTick(() => {
        expect(comp.vm.distance).to.equal('3 m');
        done();
      });
    });

    it('watches measureGeom non supported geom', () => {
      comp.setProps({measureGeom: {geom: null}});
      expect(comp.vm.distance).to.equal(' -- ');
    });
  });
});
