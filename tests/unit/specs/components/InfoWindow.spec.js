import InfoWindow from '@/components/InfoWindow';

describe('InfoWindow.vue', () => {
  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(InfoWindow.data).to.be.a('function');
    const defaultData = InfoWindow.data();
    expect(defaultData).to.be.an('object');
  });
});
