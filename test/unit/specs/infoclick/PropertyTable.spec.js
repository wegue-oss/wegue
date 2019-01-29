import Vue from 'vue'
import PropertyTable from '@/components/infoclick/PropertyTable'

describe('infoclick/PropertyTable.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof PropertyTable).to.not.equal('undefined');
  });

  it('has the correct properties', () => {
    // Extend the component to get the constructor, which we can then
    // initialize directly.
    const Constructor = Vue.extend(PropertyTable);
    const comp = new Constructor({
      // Props are passed in "propsData"
      propsData: {
        properties: null
      }
    }).$mount();

    expect(comp.color).to.equal('red darken-3');
    expect(comp.properties).to.equal(null);
  });
});
