import { shallowMount } from '@vue/test-utils';
import MeasureTypeChooser from '@/components/measuretool/MeasureTypeChooser';

describe('measuretool/MeasureTypeChooser.vue', () => {
  it('is defined', () => {
    expect(typeof MeasureTypeChooser).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(MeasureTypeChooser);
    });

    it('has correct default props', () => {
      expect(comp.vm.measureType).to.equal('distance');
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(MeasureTypeChooser);
    });

    it('has correct default data', () => {
      expect(comp.vm.measureTypeData).to.equal('distance');
    });
  });

  describe('watchers', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(MeasureTypeChooser);
    });

    it('watches measureTypeData fires event "wgu-measuretype-change"', done => {
      let cnt = 0;
      comp.vm.$on('wgu-measuretype-change', () => {
        cnt++;
      });
      comp.vm.measureTypeData = 'kalle';
      comp.vm.$nextTick(() => {
        expect(cnt).to.equal(1);
        done();
      });
    });
  });
});
