import Vue from 'vue'
import MeasureResult from '@/components/measuretool/MeasureResult'

describe('measuretool/MeasureWin.vue', () => {
  it('is defined', () => {
    expect(typeof MeasureResult).to.not.equal('undefined');
  });

  it('has the correct properties', () => {
    // Extend the component to get the constructor, which we can then
    // initialize directly.
    const Constructor = Vue.extend(MeasureResult);
    const comp = new Constructor({
      // Props are passed in "propsData"
      propsData: {}
    }).$mount();

    expect(comp.measureGeom).to.equal(undefined);
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof MeasureResult.data).to.equal('function');
    const defaultData = MeasureResult.data();
    expect(defaultData.area).to.equal(' -- ');
    expect(defaultData.distance).to.equal(' -- ');
  });

  it('has the correct functions', () => {
    const Constructor = Vue.extend(MeasureResult);
    const vm = new Constructor().$mount();
    expect(typeof vm.formatLength).to.equal('function');
    expect(typeof vm.formatArea).to.equal('function');
  });
});
