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

/**
 * OpenCage Provider, needs key. See https://opencagedata.com.
 *
 * @class OpenCage
 *
 */
export class OpenCage {
  /**
   * @constructor
   */
  constructor () {
    this.settings = {
      url: 'https://api.opencagedata.com/geocode/v1/json?',
      params: {
        q: '',
        key: '',
        limit: 10,
        countrycodes: '',
        language: 'en-US',
        pretty: 1,
        no_annotations: 1
      }
    };
  }

  getParameters (options) {
    return {
      url: this.settings.url,
      params: {
        q: options.query,
        key: options.key,
        limit: options.limit || this.settings.params.limit,
        countrycode: options.countrycodes || this.settings.params.countrycodes,
        language: options.language || this.settings.params.language
      }
    };
  }

  handleResponse (results) {
    if (!results.results || results.results.length === 0) {
      return;
    }
    return results.results.map(result => ({
      lon: result.geometry.lng,
      lat: result.geometry.lat,
      boundingbox: result.bounds && [result.bounds.southwest.lng, result.bounds.southwest.lat, result.bounds.northeast.lng, result.bounds.northeast.lat],
      address: {
        name: result.formatted,
        road: result.components.road || '',
        houseNumber: result.components.house_number || '',
        postcode: result.components.postcode || '',
        city: result.components.city || result.components.town || '',
        state: result.components.state || '',
        country: result.components.country || ''
      },
      original: {
        formatted: result.formatted,
        details: result.components
      }
    }));
  }
}
