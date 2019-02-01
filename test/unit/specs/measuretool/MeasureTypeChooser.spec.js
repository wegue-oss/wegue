import Vue from 'vue'
import MeasureTypeChooser from '@/components/measuretool/MeasureTypeChooser'

describe('measuretool/MeasureWin.vue', () => {
  it('is defined', () => {
    expect(typeof MeasureTypeChooser).to.not.equal('undefined');
  });

  it('has the correct properties', () => {
    // Extend the component to get the constructor, which we can then
    // initialize directly.
    const Constructor = Vue.extend(MeasureTypeChooser);
    const comp = new Constructor({
      // Props are passed in "propsData"
      propsData: {}
    }).$mount();

    expect(comp.measureType).to.equal('distance');
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof MeasureTypeChooser.data).to.equal('function');
    const defaultData = MeasureTypeChooser.data();
    expect(defaultData.measureTypeData).to.equal(undefined);
  });
});
