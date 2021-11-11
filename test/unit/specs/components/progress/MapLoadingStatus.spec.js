import MapLoadingStatus from '@/components/progress/MapLoadingStatus'

describe('progress/MapLoadingStatus.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof MapLoadingStatus).to.not.equal('undefined');
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof MapLoadingStatus.data).to.equal('function');
    const defaultData = MapLoadingStatus.data();
    expect(defaultData.loading).to.equal(0);
    expect(defaultData.visible).to.equal(false);
  });
});
