import AppLogo from '@/components/AppLogo'

describe('AppLogo.vue', () => {
  it('sets the correct default data', () => {
    AppLogo.$appConfig = {};
    expect(typeof AppLogo.data).to.equal('function');
    const data = AppLogo.data();
    expect(data.logoSrc).to.equal(undefined);
    expect(data.logoSize).to.equal(undefined);
  });

  it('applies correct data from $appConfig', () => {
    AppLogo.$appConfig = {
      logo: 'foobar',
      logoSize: 100
    };
    expect(typeof AppLogo.data).to.equal('function');
    const data = AppLogo.data();
    expect(data.logoSrc).to.equal('foobar');
    expect(data.logoSize).to.equal(100);
  });
});
