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

import { OpenStreetMap } from './providers/osm';
import { Photon } from './providers/photon';
import { OpenCage } from './providers/opencage';
import axios from 'axios';

// Geocoder Provider types
export const PROVIDERS = {
  osm: OpenStreetMap,
  photon: Photon,
  opencage: OpenCage
};

/**
 * @class GeocoderController
 */
export class GeocoderController {
  /**
   * @constructor
   * @param {String} providerName name of Provider.
   * @param {Object} options config options for Provider
   */
  constructor (providerName, options) {
    this.options = options;
    this.abortController = null;

    // Must have Provider class defined for name
    if (!Object.prototype.hasOwnProperty.call(PROVIDERS, providerName)) {
      console.warn(`No class defined for Geocoder Provider: '${providerName}'`);
      return;
    }
    // Create Provider from name via Factory Method
    this.provider = new PROVIDERS[providerName]();
  }

  destroy () {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  async query (q) {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    const parameters = this.provider.getParameters({
      query: q,
      key: this.options.key,
      lang: this.options.lang,
      countrycodes: this.options.countrycodes,
      limit: this.options.limit
    });

    const request = {
      method: 'GET',
      url: parameters.url,
      params: parameters.params,
      signal: this.abortController?.signal
    };

    const response = await axios(request);
    return this.provider.handleResponse(response.data);
  }
};
