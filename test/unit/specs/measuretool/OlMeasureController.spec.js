import OlMeasureController from '@/components/measuretool/OlMeasureController'

describe('measuretool/MeasureWin.vue', () => {
  it('is defined', () => {
    expect(typeof OlMeasureController).to.not.equal('undefined');
  });

  it('has the correct functions', () => {
    const olmc = new OlMeasureController();
    expect(typeof olmc.createMeasureLayer).to.equal('function');
    expect(typeof olmc.addInteraction).to.equal('function');
    expect(typeof olmc.removeInteraction).to.equal('function');
  });
});
