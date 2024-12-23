import UrlUtil from '@/util/Url';

describe('UrlUtil', () => {
  it('is defined', () => {
    expect(UrlUtil).to.not.be.an('undefined');
  });

  it('has the correct functions', () => {
    expect(UrlUtil.getQueryParams).to.be.a('function');
    expect(UrlUtil.getQueryParam).to.be.a('function');
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

    expect(paramVal).to.be.undefined;
  });

  it('getQueryParams uses window.location.search if querySearch is not passed', () => {
    const paramsObj = UrlUtil.getQueryParams();

    expect(paramsObj).to.eql({});
  });

  it('getQueryParam uses window.location.search if querySearch is not passed', () => {
    const paramVal = UrlUtil.getQueryParam('foo');

    expect(paramVal).to.be.undefined;
  });

  it('toQueryString returns correct query string', () => {
    const params = {
      foo: 'bar',
      kalle: 0,
      ralle: 8.88,
      bully: true,
      nullinger: null,
      obj: {
        sub1: 1
      }
    };
    const queryString = UrlUtil.toQueryString(params);

    expect(queryString).to.eql('foo=bar&kalle=0&ralle=8.88&bully=true&sub1=1');
  });
});
