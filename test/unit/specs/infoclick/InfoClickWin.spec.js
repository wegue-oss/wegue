import Vue from 'vue'
import InfoClickWin from '@/components/infoclick/InfoClickWin'

describe('infoclick/InfoClickWin.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof InfoClickWin).to.not.equal('undefined');
  });

  it('has a created hook', () => {
    expect(typeof InfoClickWin.created).to.equal('function');
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof InfoClickWin.data).to.equal('function');
    const defaultData = InfoClickWin.data();
    expect(defaultData.show).to.equal(false);
    expect(defaultData.left).to.equal('2px');
    expect(defaultData.top).to.equal('270px');
    expect(defaultData.attributeData).to.equal(null);
    expect(defaultData.coordsData).to.equal(null);
  });

  // Mount an instance and inspect the render output
  it('does not render on startup', () => {
    const Constructor = Vue.extend(InfoClickWin);
    const vm = new Constructor().$mount();
    // el is not undefined but this tests that it is not rendered
    expect(vm.$el.textContent).to.equal('');
  });
});
