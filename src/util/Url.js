/**
 * URL related util methods
 */
const UrlUtil = {

  /**
   * Parses query string like a=b&c=d&e=f etc of the given search part (querySearch) of an URL
   * as JS object (key-value). Uses ES6 coding/parsing as in:
   * https://www.arungudelli.com/tutorial/javascript/get-query-string-parameter-values-from-url-using-javascript/
   *
   * @param  {String} query Search part (queryString) of an URL
   * @return {Object}             Key-value pairs of the URL parameters
   */
  parseQueryString (query) {
    return (/^[?#]/.test(query) ? query.slice(1) : query)
      .split('&')
      .reduce((params, param) => {
        let [key, value] = param.split('=');
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
      }, {});
  },

  /**
   * Returns the query params of the current 'location' from 'hash' or 'search'.
   *
   * @param  {String} locationType use query or hash part of URL
   * @return {Object}             Key-value pairs of the URL parameters
   */
  getParams (locationType) {
    const querySearch = document.location[locationType].substring(1);
    if (!querySearch || querySearch === '') {
      return {};
    }
    return this.parseQueryString(querySearch);
  },

  /**
   * Returns all query params of the given search part (querySearch) of an URL
   * as JS object (key-value).
   * If querySearch is not provided it is derived from the current location.
   *
   * @param  {String} querySearch Search part (querySearch) of an URL
   * @return {Object} Key-value pairs of the URL parameters, may be empty {}.
   */
  getQueryParams (querySearch) {
    if (!querySearch) {
      querySearch = document.location.search.substring(1);
    }

    if (!querySearch || querySearch === '') {
      return {};
    }

    return this.parseQueryString(querySearch);
  },

  /**
   * Returns all query params of the given hash part (hash) of an URL
   * as JS object (key-value).
   * If hash is not provided it is derived from the current location.
   *
   * @param  {String} hash Search part (hash) of an URL
   * @return {Object} Key-value pairs of the URL parameters
   */
  getHashParams (hash) {
    if (!hash) {
      hash = document.location.hash.substring(1);
    }

    return this.parseQueryString(hash);
  },

  /**
   * Returns a dedicated URL parameter if existing.
   * If querySearch is not provided it is derived from the current location.
   *
   * @param  {String} param       The URL param name
   * @param  {String} querySearch Search part (querySearch) of an URL
   * @return {String}             Value of the given URL param
   */
  getQueryParam (param, querySearch) {
    const params = this.getQueryParams(querySearch);
    let value;
    Object.keys(params).forEach(key => {
      if (key === param) {
        value = params[key];
      }
    });

    return value;
  },

  /**
   * Returns a query string from an object of key/value pairs.
   *
   * @param  {String} obj object with key/values to encode.
   * @return {String} the encoded query string
   */
  toQueryString (obj) {
    return Object.keys(obj)
      .reduce((a, k) => {
        a.push(
          typeof obj[k] === 'object'
            ? this.toQueryString(obj[k])
            : `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`
        );
        return a;
      }, [])
      .join('&');
  }

};

export default UrlUtil;
