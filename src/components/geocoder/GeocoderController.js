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

// import LayerVector from 'ol/layer/Vector';
// import SourceVector from 'ol/source/Vector';
// import Point from 'ol/geom/Point';
// import Feature from 'ol/Feature';
// import proj from 'ol/proj';
import { OpenStreet } from './providers/osm';
import { Photon } from './providers/photon';
import { OpenCage } from './providers/opencage';
// import { MapQuest } from './providers/mapquest';
// import { Bing } from './providers/bing';
// import { VARS, TARGET_TYPE, PROVIDERS, EVENT_TYPE } from 'konstants';
// import { randomId, flyTo } from 'helpers/mix';
import { json } from './helpers/ajax';
// import {
//   hasClass,
//   addClass,
//   removeClass,
//   createElement,
//   template,
//   removeAllChildren,
// } from 'helpers/dom';
//
// const klasses = VARS.cssClasses;

export const PROVIDERS = {
  OSM: 'osm',
  PHOTON: 'photon',
  OPENCAGE: 'opencage'
};

export const DEFAULT_OPTIONS = {
  provider: PROVIDERS.PHOTON,
  placeholder: 'Search for an address',
  // featureStyle: null,
  // targetType: TARGET_TYPE.GLASS,
  lang: 'en-US',
  limit: 5,
  keepOpen: false,
  preventDefault: false,
  autoComplete: false,
  autoCompleteMinLength: 2,
  debug: false
};

/**
 * @class GeocoderController
 */
export class GeocoderController {
  /**
   * @constructor
   * @param {Function} base Base class.
   */
  constructor (providerName, options, parent) {
    this.options = options;
    this.provider = this.newProvider(providerName);
    this.parent = parent;
  }

  trace (str) {
    this.options.debug && console.info(str);
  }

  query (q) {
    const parameters = this.provider.getParameters({
      query: q,
      key: this.options.key,
      lang: this.options.lang,
      countrycodes: this.options.countrycodes,
      limit: this.options.limit
    });

    let ajax = {
      url: parameters.url,
      data: parameters.params
    };

    if (parameters.callbackName) {
      ajax.jsonp = true;
      ajax.callbackName = parameters.callbackName;
    }

    json(ajax)
      .then(response => {
        // will be fullfilled according to provider
        this.trace('response ok');
        this.parent.onQueryResult(this.provider.handleResponse(response));
      })
      .catch(err => {
        this.parent.onQueryResult(undefined, err);
      });
  }

  newProvider (providerName) {
    switch (providerName) {
      case PROVIDERS.OSM:
        return new OpenStreet();
      case PROVIDERS.PHOTON:
        return new Photon();
      case PROVIDERS.OPENCAGE:
        return new OpenCage();
      default:
        return null;
    }
  }
}
