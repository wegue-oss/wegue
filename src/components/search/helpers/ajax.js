// Code modified from: https://github.com/jonataswalker/ol-geocoder version: July 30, 2019
// The MIT License (MIT)
//
// Copyright (c) 2015 Jonatas Walker
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// TODO: may use Axios/Axios-jsonp
export function json (obj) {
  return new Promise((resolve, reject) => {
    const url = encodeUrlXhr(obj.url, obj.data);
    const config = {
      method: 'GET',
      mode: 'cors',
      credentials: 'same-origin'
    };

    if (obj.jsonp) {
      jsonp(url, obj.callbackName, resolve);
    } else {
      fetch(url, config)
        .then(r => r.json())
        .then(resolve)
        .catch(reject);
    }
  });
}

function toQueryString (obj) {
  return Object.keys(obj)
    .reduce((a, k) => {
      a.push(
        typeof obj[k] === 'object'
          ? toQueryString(obj[k])
          : `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`
      );
      return a;
    }, [])
    .join('&');
}

function encodeUrlXhr (url, data) {
  if (data && typeof data === 'object') {
    url += (/\?/.test(url) ? '&' : '?') + toQueryString(data);
  }
  return url;
}

function jsonp (url, key, callback) {
  // https://github.com/Fresheyeball/micro-jsonp/blob/master/src/jsonp.js
  let head = document.head;
  let script = document.createElement('script');
  // generate minimally unique name for callback function
  let callbackName = 'f' + Math.round(Math.random() * Date.now());

  // set request url
  script.setAttribute(
    'src',
    /*  add callback parameter to the url
          where key is the parameter key supplied
          and callbackName is the parameter value */
    url + (url.indexOf('?') > 0 ? '&' : '?') + key + '=' + callbackName
  );

  /*  place jsonp callback on window,
      the script sent by the server should call this
      function as it was passed as a url parameter */
  window[callbackName] = data => {
    window[callbackName] = undefined;

    // clean up script tag created for request
    setTimeout(() => head.removeChild(script), 0);

    // hand data back to the user
    callback(data);
  };

  // actually make the request
  head.appendChild(script);
}
