import Vue from 'vue'
import InfoClickToggleBtn from '@/components/infoclick/ToggleButton'

describe('infoclick/ToggleButton.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof InfoClickToggleBtn).to.not.equal('undefined');
  });

  it('has the correct properties', () => {
    // Extend the component to get the constructor, which we can then
    // initialize directly.
    const Constructor = Vue.extend(InfoClickToggleBtn);
    const comp = new Constructor({
      // Props are passed in "propsData"
      propsData: {}
    }).$mount();

    expect(comp.icon).to.equal('info');
    expect(comp.text).to.equal('');
  });

  it('has a created hook', () => {
    expect(typeof InfoClickToggleBtn.created).to.equal('function');
  });

  // Check methods
  it('has a method toggleUi', () => {
    const Constructor = Vue.extend(InfoClickToggleBtn);
    const ictb = new Constructor({
    }).$mount();
    expect(typeof ictb.toggleUi).to.equal('function');
  });

  // Evaluate the results of functions
  it('sets the correct default data', () => {
    expect(typeof InfoClickToggleBtn.data).to.equal('function');
    const defaultData = InfoClickToggleBtn.data();
    expect(typeof defaultData).to.equal('object');
    expect(defaultData.moduleName).to.equal('wgu-infoclick');
  });
});
