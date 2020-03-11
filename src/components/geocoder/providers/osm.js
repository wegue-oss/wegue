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
 * OpenStreetMap Nominatim Provider. See https://nominatim.openstreetmap.org.
 *
 * @class OpenStreetMap
 */
export class OpenStreetMap {
  /**
   * @constructor
   */
  constructor () {
    this.settings = {
      url: 'https://nominatim.openstreetmap.org/search/',
      params: {
        q: '',
        format: 'json',
        addressdetails: 1,
        limit: 10,
        countrycodes: '',
        'accept-language': 'en-US'
      }
    };
  }

  getParameters (opt) {
    return {
      url: this.settings.url,
      params: {
        q: opt.query,
        format: this.settings.params.format,
        addressdetails: this.settings.params.addressdetails,
        limit: opt.limit || this.settings.params.limit,
        countrycodes: opt.countrycodes || this.settings.params.countrycodes,
        'accept-language': opt.lang || this.settings.params['accept-language']
      }
    };
  }

  handleResponse (results) {
    if (!results || results.length === 0) {
      return;
    }
    return results.map(function (result) {
      result = {
        lon: Number.parseFloat(result.lon),
        lat: Number.parseFloat(result.lat),
        boundingbox: result.boundingbox.map(x => Number.parseFloat(x)),
        address: {
          name: result.display_name,
          road: result.address.road || '',
          houseNumber: result.address.house_number || '',
          postcode: result.address.postcode || '',
          city: result.address.city || result.address.town || '',
          state: result.address.state || '',
          country: result.address.country || ''
        },
        original: {
          formatted: result.display_name,
          details: result.address
        }
      };
      // Make bbox llx,lly,urx,ury
      const bbox = result.boundingbox;
      result.boundingbox = [bbox[2], bbox[0], bbox[3], bbox[1]];
      return result;
    });
  }
}
