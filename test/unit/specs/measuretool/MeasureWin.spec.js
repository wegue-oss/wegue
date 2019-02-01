import Vue from 'vue'
import MeasureWin from '@/components/measuretool/MeasureWin'

describe('measuretool/MeasureWin.vue', () => {
  it('is defined', () => {
    expect(typeof MeasureWin).to.not.equal('undefined');
  });

  it('has the correct properties', () => {
    // Extend the component to get the constructor, which we can then
    // initialize directly.
    const Constructor = Vue.extend(MeasureWin);
    const comp = new Constructor({
      // Props are passed in "propsData"
      propsData: {}
    }).$mount();

    expect(comp.color).to.equal('red darken-3');
    expect(comp.icon).to.equal('photo_size_select_small');
    expect(comp.title).to.equal('Measure');
    expect(comp.draggable).to.equal(true);
    expect(comp.initPos).to.equal(undefined);
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof MeasureWin.data).to.equal('function');
    const defaultData = MeasureWin.data();
    expect(defaultData.moduleName).to.equal('wgu-measuretool');
    expect(defaultData.measureGeom).to.equal(null);
    expect(defaultData.measureType).to.equal('distance');
    expect(defaultData.show).to.equal(false);
    expect(defaultData.left).to.equal('0');
    expect(defaultData.top).to.equal('0');
  });

  it('has the correct functions', () => {
    const Constructor = Vue.extend(MeasureWin);
    const vm = new Constructor().$mount();
    expect(typeof vm.applyMeasureType).to.equal('function');
    expect(typeof vm.onMapBound).to.equal('function');
  });

  // Mount an instance and inspect the render output
  it('does not render on startup', () => {
    const Constructor = Vue.extend(MeasureWin);
    const vm = new Constructor().$mount();
    // el is not undefined but this tests that it is not rendered
    expect(vm.$el.textContent).to.equal('');
  });
});
