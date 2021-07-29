import UrlUtil from '@/util/Url'

describe('UrlUtil', () => {
  it('is defined', () => {
    expect(typeof UrlUtil).to.not.equal(undefined);
  });

  it('has the correct functions', () => {
    expect(typeof UrlUtil.getQueryParams).to.equal('function');
    expect(typeof UrlUtil.getQueryParam).to.equal('function');
  });

  it('getQueryParams parses the URL params correctly', () => {
    const paramStr = 'foo=bar&kalle=ralle';
    const paramsObj = UrlUtil.getQueryParams(paramStr);
    expect(paramsObj).to.be.an('object');
    expect(paramsObj).to.eql({ foo: 'bar', kalle: 'ralle' });
  });

  it('getQueryParam parses the URL params correctly', () => {
    const paramStr = 'foo=bar&kalle=ralle';
    const paramVal = UrlUtil.getQueryParam('kalle', paramStr);
    expect(paramVal).to.be.a('string');
    expect(paramVal).to.equal('ralle');
  });

  it('getQueryParam returns undefined for nonexistent param', () => {
    const paramStr = 'kalle=ralle';
    const paramVal = UrlUtil.getQueryParam('foo', paramStr);
    expect(paramVal).to.equal(undefined);
  });

  it('getQueryParams uses window.location.search if querySearch is not passed', () => {
    const paramsObj = UrlUtil.getQueryParams();
    expect(paramsObj).to.eql({});
  });

  it('getQueryParam uses window.location.search if querySearch is not passed', () => {
    const paramVal = UrlUtil.getQueryParam('foo');
    expect(paramVal).to.equal(undefined);
  });
});
