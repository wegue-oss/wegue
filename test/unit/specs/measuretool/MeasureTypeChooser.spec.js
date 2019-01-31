import MeasureTypeChooser from '@/components/measuretool/MeasureTypeChooser'

describe('measuretool/MeasureWin.vue', () => {
  it('is defined', () => {
    expect(typeof MeasureTypeChooser).to.not.equal('undefined');
  });

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof MeasureTypeChooser.data).to.equal('function');
    const defaultData = MeasureTypeChooser.data();
    expect(defaultData.measureType).to.equal('distance');
  });
});
