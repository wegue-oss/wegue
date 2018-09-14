import Vue from 'vue'
import InfoClickToggleBtn from '@/components/infoclick/ToggleButton'

describe('infoclick/ToggleButton.vue', () => {
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
  });
});
