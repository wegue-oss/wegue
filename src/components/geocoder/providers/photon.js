// Code modified from: https://github.com/jonataswalker/ol-geocoder version: Aug 01, 2019
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
//

/**
 * Photon Provider. See https://photon.komoot.de.
 *
 * @class Photon
 */
export class Photon {
  /**
   * @constructor
   */
  constructor () {
    this.settings = {
      url: 'https://photon.komoot.de/api/',
      params: {
        q: '',
        limit: 10,
        lang: 'en'
      },
      langs: ['de', 'it', 'fr', 'en']
    };
  }

  getParameters (options) {
    options.lang = options.lang.toLowerCase();

    return {
      url: this.settings.url,
      params: {
        q: options.query,
        limit: options.limit || this.settings.params.limit,
        lang:
          this.settings.langs.indexOf(options.lang) > -1
            ? options.lang
            : this.settings.params.lang
      }
    };
  }

  handleResponse (results) {
    if (!results.features.length) return;
    return results.features.map(function (feature) {
      // Response is GeoJSON
      const geometry = feature.geometry;
      const properties = feature.properties;
      const displayName = `${properties.name} ${properties.city || ''} ${properties.postcode || ''} ${properties.state || ''} ${properties.country || ''}`;
      let result = {
        lon: geometry.coordinates[0],
        lat: geometry.coordinates[1],
        address: {
          name: displayName,
          postcode: properties.postcode || '',
          city: properties.city || '',
          state: properties.state || '',
          country: properties.country || ''
        },
        original: {
          formatted: displayName,
          details: properties
        }
      };
      // Sometimes has bbox
      if (properties.extent) {
        result.boundingbox = properties.extent;
      }
      return result;
    });
  }
}
