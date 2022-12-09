import AppLoadingMask from '@/components/AppLoadingMask'

describe('AppLoadingMask.vue', () => {
  it('sets the correct default data', () => {
    AppLoadingMask.$appConfig = {};
    expect(typeof AppLoadingMask.data).to.equal('function');
    const data = AppLoadingMask.data();
    expect(data.show).to.equal(false);
  });
});
