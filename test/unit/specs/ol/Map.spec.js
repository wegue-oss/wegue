import Vue from 'vue'
import Map from '@/components/ol/Map'

describe('ol/Map.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof Map).to.not.equal('undefined');
  });

  it('has a mounted hook', () => {
    expect(typeof Map.mounted).to.equal('function');
  });

  it('has a created hook', () => {
    expect(typeof Map.created).to.equal('function');
  });

  it('has the correct properties', () => {
    // Extend the component to get the constructor, which we can then
    // initialize directly.
    const Constructor = Vue.extend(Map);
    const comp = new Constructor({
      // Props are passed in "propsData"
      propsData: {}
    }).$mount();

    expect(comp.color).to.equal('red darken-3');
    expect(comp.collapsibleAttribution).to.equal(false);
    expect(comp.rotateableMap).to.equal(false);
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    Map.$appConfig = {
      zoom: undefined,
      center: undefined,
      projectionDefs: undefined,
      projection: undefined
    };
    expect(typeof Map.data).to.equal('function');
    const defaultData = Map.data();
    expect(defaultData.zoom).to.equal(undefined);
    expect(defaultData.center).to.equal(undefined);
    expect(defaultData.projection).to.equal(undefined);
    expect(defaultData.projectionDefs).to.equal(undefined);
  });

  it('has a the correct functions', () => {
    const Constructor = Vue.extend(Map);
    const map = new Constructor({
    }).$mount();
    expect(typeof map.createLayers).to.equal('function');
    expect(typeof map.setOlButtonColor).to.equal('function');
  });
});
