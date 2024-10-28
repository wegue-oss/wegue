import { mount } from '@vue/test-utils';
import { bindMap, unbindMap } from '@/composables/Map';
import Geocoder from '@/components/geocoder/Geocoder';
import { OpenStreetMap } from '@/components/geocoder/providers/osm';
import { Photon } from '@/components/geocoder/providers/photon';
import { OpenCage } from '@/components/geocoder/providers/opencage';
import OlMap from 'ol/Map';
import { applyTransform, getCenter } from 'ol/extent';
import { getTransform } from 'ol/proj';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

function createWrapper (options = {}) {
  return mount(Geocoder, options);
}

describe('geocoder/Geocoder.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(Geocoder).to.not.be.undefined;
  });

  it('has a mounted hook', () => {
    expect(Geocoder.mounted).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('md:search');
      expect(vm.rounded).to.be.true;
      expect(vm.autofocus).to.be.true;
      expect(vm.persistentHint).to.be.true;
    });
  });

  describe('default data and Provider', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data and Provider', () => {
      expect(vm.hideSearch).to.be.true;
      expect(vm.minChars).to.equal(3);
      expect(vm.queryDelay).to.equal(300);
      expect(vm.geocoderController).to.not.be.undefined;
      expect(vm.geocoderController.provider instanceof OpenStreetMap).to.be.true;
    });
  });

  describe('configured data and Provider - Photon', () => {
    beforeEach(() => {
      const moduleProps = {
        target: 'toolbar',
        minChars: 5,
        queryDelay: 200,
        debug: false,
        provider: 'photon'
      };

      comp = createWrapper({ props: moduleProps });
      vm = comp.vm;
    });

    it('has correct configured data and Provider', () => {
      expect(vm.hideSearch).to.be.true;
      expect(vm.minChars).to.equal(5);
      expect(vm.queryDelay).to.equal(200);
      expect(vm.geocoderController).to.not.be.undefined;
      expect(vm.geocoderController.provider instanceof Photon).to.be.true;
    });
  });

  describe('configured data and Provider - OpenCage', () => {
    beforeEach(() => {
      const moduleProps = {
        target: 'toolbar',
        minChars: 6,
        queryDelay: 200,
        debug: false,
        provider: 'opencage'
      };

      comp = createWrapper({ props: moduleProps });
      vm = comp.vm;
    });

    it('has correct configured data and Provider', () => {
      expect(vm.hideSearch).to.be.true;
      expect(vm.minChars).to.equal(6);
      expect(vm.queryDelay).to.equal(200);
      expect(vm.geocoderController).to.not.be.undefined;
      expect(vm.geocoderController.provider instanceof OpenCage).to.be.true;
    });
  });

  describe('methods - search', () => {
    let map;
    let axiosMock;
    let onQueryResultsSpy;
    let onQueryErrorSpy;
    const osmURL = 'https://nominatim.openstreetmap.org/search';
    const fetchResults = JSON.stringify([
      {
        lon: '7.0928944',
        lat: '50.7400352',
        boundingbox: ['50.7399852', '50.7400852', '7.0928444', '7.0929444'],
        display_name: 'John Barleycorn, 52, Heerstraße, Altstadt, Nordstadt, Stadtbezirk Bonn, Bonn, North Rhine-Westphalia, 53111, Germany',
        address: {
          amenity: 'John Barleycorn',
          house_number: '52',
          road: 'Heerstraße',
          neighbourhood: 'Altstadt',
          quarter: 'Nordstadt',
          city_district: 'Stadtbezirk Bonn',
          city: 'Bonn',
          state: 'North Rhine-Westphalia',
          'ISO3166-2-lvl4': 'DE-NW',
          postcode: '53111',
          country: 'Germany',
          country_code: 'de'
        }
      },
      {
        lon: '7.092862308035045',
        lat: '50.7400625',
        boundingbox: ['50.7399456', '50.7402129', '7.0926186', '7.0931026'],
        display_name: '52, Heerstraße, Altstadt, Nordstadt, Stadtbezirk Bonn, Bonn, North Rhine-Westphalia, 53111, Germany',
        address: {
          house_number: '52',
          road: 'Heerstraße',
          neighbourhood: 'Altstadt',
          quarter: 'Nordstadt',
          city_district: 'Stadtbezirk Bonn',
          city: 'Bonn',
          state: 'North Rhine-Westphalia',
          'ISO3166-2-lvl4': 'DE-NW',
          postcode: '53111',
          country: 'Germany',
          country_code: 'de'
        }
      }
    ]);
    let clock;
    const queryString = 'Heerstraße 52 bonn';
    let selectionItems;

    function applyAxiosMock (error = false) {
      axiosMock = new MockAdapter(axios);
      if (!error) {
        axiosMock.onGet(osmURL).reply(200, fetchResults);
      } else {
        axiosMock.onGet(osmURL).networkError();
      }
    };

    beforeEach(() => {
      const moduleProps = {
        target: 'toolbar',
        queryDelay: 2,
        provider: 'osm'
      };

      comp = createWrapper({ props: moduleProps });
      vm = comp.vm;

      onQueryResultsSpy = sinon.replace(vm, 'onQueryResults', sinon.fake(vm.onQueryResults));
      onQueryErrorSpy = sinon.replace(vm, 'onQueryError', sinon.fake(vm.onQueryError));
      clock = sinon.useFakeTimers();
    });

    it('functions are implemented', () => {
      expect(vm.toggle).to.be.a('function');
      expect(vm.querySelections).to.be.a('function');
      expect(vm.onQueryResults).to.be.a('function');
    });

    it('GeoCoderController calls remote service', done => {
      vm.geocoderController.query(queryString).then(results => {
        expect(results).to.not.be.undefined;
        expect(results).to.not.be.empty;
        expect(results[0].address.road).to.equal('Heerstraße');
        done();
      });
    });

    it('search method assigns last query string', async () => {
      applyAxiosMock();

      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);
      await clock.tickAsync(200);

      expect(vm.lastQueryStr === queryString).to.equal(true);
    });

    it('search method query with results', async () => {
      applyAxiosMock();

      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);
      await clock.tickAsync(200);

      expect(vm.results).to.not.be.undefined;
      expect(vm.results).to.not.be.empty;
      expect(vm.results[0].address.road).to.equal('Heerstraße');

      // Items from query result should be assigned to combobox
      selectionItems = comboBox.props('items');
      expect(selectionItems).to.not.be.undefined;
      expect(selectionItems).to.have.length(vm.results.length);
    });

    it('selected item watcher assigns result and zooms/centers Map at result', async () => {
      applyAxiosMock();
      // vm.map = new OlMap();
      map = new OlMap();
      bindMap(map);

      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);
      await clock.tickAsync(200);
      selectionItems = comboBox.props('items');
      await comp.setData({ selected: selectionItems[0] });

      // Map center should be at coordinates from selected item
      const mapCenter = vm.map.getView().getCenter();

      // Map may have different projection than WGS84
      const extent = applyTransform(
        selectionItems[0].value.boundingbox,
        getTransform('EPSG:4326', vm.map.getView().getProjection()));
      const coords = getCenter(extent);

      expect(mapCenter[0]).to.equal(coords[0]);
      expect(mapCenter[1]).to.equal(coords[1]);
    });

    it('calls onQueryResults if fetch successful', async () => {
      applyAxiosMock();

      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);
      await clock.tickAsync(200);

      expect(onQueryResultsSpy).to.have.been.called;
    });

    it('calls onQueryError if error during fetch', async () => {
      applyAxiosMock(true);

      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);
      await clock.tickAsync(200);

      expect(onQueryErrorSpy).to.have.been.called;
    });

    afterEach(() => {
      unbindMap();
      map = undefined;

      if (axiosMock) {
        axiosMock.restore();
      }

      // Like before we must clean up when tampering with globals.
      clock.restore();
      sinon.restore();
    });
  });

  describe('user interactions for search activation', () => {
    beforeEach(() => {
      comp = createWrapper({ attachTo: document.body });
      vm = comp.vm;
    });

    it('toggle show/hides search input', () => {
      vm.toggle();
      expect(vm.hideSearch).to.be.false;
      vm.toggle();
      expect(vm.hideSearch).to.be.true;
    });

    it('button click should toggle search input visibility', async () => {
      // Two subwidgets
      const button = comp.findComponent({ name: 'v-btn' });
      const comboBox = comp.findComponent({ name: 'v-combobox' });

      // Initial state
      expect(vm.hideSearch).to.be.true;
      expect(comboBox.isVisible()).to.be.false;

      // Make visible
      await button.trigger('click');

      expect(vm.hideSearch).to.be.false;
      expect(comboBox.isVisible()).to.be.true;

      // And hide
      await button.trigger('click');

      expect(vm.hideSearch).to.be.true;
      expect(comboBox.isVisible()).to.be.false;
    });

    it('search input string should trigger search', async () => {
      const queryString = 'heerstrasse 52 bonn';

      // Trigger watcher for search input string in combobox
      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);

      expect(vm.lastQueryStr).to.equal(queryString);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
