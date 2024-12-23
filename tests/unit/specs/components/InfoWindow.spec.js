import InfoWindow from '@/components/InfoWindow';

describe('InfoWindow.vue', () => {
  it('is defined', () => {
    expect(InfoWindow).to.not.be.an('undefined');
  });

  // Evaluate the results of functions in
  // the raw component options
  it('has correct default data', () => {
    expect(InfoWindow.data).to.be.a('function');
    const defaultData = InfoWindow.data();
    expect(defaultData).to.be.an('object');
  });
});
