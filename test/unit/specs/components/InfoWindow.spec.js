import InfoWindow from '@/components/InfoWindow'

describe('InfoWindow.vue', () => {
  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof InfoWindow.data).to.equal('function');
    const defaultData = InfoWindow.data();
    expect(typeof defaultData).to.equal('object');
  });
});
