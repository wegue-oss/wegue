import Vue from 'vue'
import CoordsTable from '@/components/infoclick/CoordsTable'

describe('infoclick/CoordsTable.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof CoordsTable).to.not.equal('undefined');
  });

  it('has the correct properties', () => {
    // Extend the component to get the constructor, which we can then
    // initialize directly.
    const Constructor = Vue.extend(CoordsTable);
    const comp = new Constructor({
      // Props are passed in "propsData"
      propsData: {}
    }).$mount();

    expect(comp.color).to.equal('red darken-3');
    expect(comp.coordsData).to.equal(undefined);
    expect(comp.showMapPos).to.equal(true);
    expect(comp.showWgsPos).to.equal(true);
    expect(comp.showHdms).to.equal(true);
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof CoordsTable.data).to.equal('function');
    const defaultData = CoordsTable.data();
    expect(defaultData.coordRows).to.equal(null);
  });
});
