import { mount } from '@vue/test-utils';
import Geocoder from '@/components/geocoder/Geocoder';
import { OpenStreetMap } from '@/components/geocoder/providers/osm';
import { Photon } from '@/components/geocoder/providers/photon';
import { OpenCage } from '@/components/geocoder/providers/opencage';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';

function createWrapper (options = {}) {
  return mount(Geocoder, options);
}

describe('geocoder/Geocoder.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof Geocoder).to.not.equal('undefined');
  });

  it('has a mounted hook', () => {
    expect(typeof Geocoder.mounted).to.equal('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('md:search');
      expect(vm.rounded).to.equal(true);
      expect(vm.autofocus).to.equal(true);
      expect(vm.persistentHint).to.equal(true);
    });
  });

  describe('default data and Provider', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data and Provider', () => {
      expect(vm.hideSearch).to.equal(true);
      expect(vm.minChars).to.equal(3);
      expect(vm.queryDelay).to.equal(300);
      expect(vm.geocoderController !== undefined).to.equal(true);
      expect(vm.geocoderController.provider instanceof OpenStreetMap).to.equal(true);
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
      expect(vm.hideSearch).to.equal(true);
      expect(vm.minChars).to.equal(5);
      expect(vm.queryDelay).to.equal(200);
      expect(vm.geocoderController !== undefined).to.equal(true);
      expect(vm.geocoderController.provider instanceof Photon).to.equal(true);
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
      expect(vm.hideSearch).to.equal(true);
      expect(vm.minChars).to.equal(6);
      expect(vm.queryDelay).to.equal(200);
      expect(vm.geocoderController !== undefined).to.equal(true);
      expect(vm.geocoderController.provider instanceof OpenCage).to.equal(true);
    });
  });

  describe('methods - search', () => {
    let onQueryResultsSpy;
    let onQueryErrorSpy;
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
    // let fakeXhr;
    // let clock;
    // let requests = [];
    const queryString = 'Heerstraße 52 bonn';
    let selectionItems;

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
      // TODO: Sinon Fake XMLHttpRequest and Fake Timers did not work for us...
      // clock = sinon.useFakeTimers();
      // global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      // global.XMLHttpRequest.onCreate = function (xhr) {
      // requests.push(xhr);
      // };
    });

    it('functions are implemented', () => {
      expect(typeof vm.toggle).to.equal('function');
      expect(typeof vm.querySelections).to.equal('function');
      expect(typeof vm.onQueryResults).to.equal('function');
    });

    it('GeoCoderController calls remote service', done => {
      vm.geocoderController.query(queryString).then(results => {
        expect(results === undefined).to.equal(false);
        expect(results.length > 0).to.equal(true);
        expect(results[0].address.road === 'Heerstraße').to.equal(true);
        done();
      });
    });

    it('search method assigns last query string', done => {
      sinon.replace(window, 'fetch', sinon.fake.resolves(new Response(fetchResults)));

      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);
      vm.$nextTick(() => {
        setTimeout(function () {
          expect(vm.lastQueryStr === queryString).to.equal(true);
          done();
        }, 50);
      });
    });

    it('search method query with results', done => {
      sinon.replace(window, 'fetch', sinon.fake.resolves(new Response(fetchResults)));

      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);
      vm.$nextTick(() => {
        // We do a timeout, to beat setTimeout() with async query in Geocoder
        // TODO find a more elegant way. sinon.useFakeTimers did not work for us.
        setTimeout(function () {
          expect(vm.results === undefined).to.equal(false);
          expect(vm.results.length > 0).to.equal(true);
          expect(vm.results[0].address.road === 'Heerstraße').to.equal(true);

          // Items from query result should be assigned to combobox
          selectionItems = comboBox.props('items');
          expect(selectionItems === undefined).to.equal(false);
          expect(selectionItems.length === vm.results.length).to.equal(true);
          done();
        }, 50);
      });
    });

    it('selected item watcher assigns result and zooms/centers Map at result', done => {
      sinon.replace(window, 'fetch', sinon.fake.resolves(new Response(fetchResults)));

      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);
      vm.$nextTick(() => {
        setTimeout(function () {
          selectionItems = comboBox.props('items');
          vm.map = new OlMap();
          comp.setData({ selected: selectionItems[0] });
          vm.$nextTick(() => {
            // Map center should be at coordinates from selected item
            const mapCenter = vm.map.getView().getCenter();

            // Map may have different projection than WGS84
            const coords = fromLonLat(
              [selectionItems[0].value.lon, selectionItems[0].value.lat],
              vm.map.getView().getProjection());
            expect(mapCenter[0] === coords[0]);
            expect(mapCenter[1] === coords[1]);
            done();
          });
        }, 50);
      });
    });

    it('calls onQueryResults if fetch successful', done => {
      sinon.replace(window, 'fetch', sinon.fake.resolves(new Response(fetchResults)))

      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);
      vm.$nextTick(() => {
        setTimeout(function () {
          expect(onQueryResultsSpy).to.have.been.called;
          done();
        }, 50);
      });
    })

    it('calls onQueryError if error during fetch', done => {
      sinon.replace(window, 'fetch', sinon.fake.rejects());

      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);
      vm.$nextTick(() => {
        setTimeout(function () {
          expect(onQueryErrorSpy).to.have.been.called;
          done();
        }, 50);
      });
    })

    afterEach(function () {
      sinon.restore();
      // Like before we must clean up when tampering with globals.
      // global.XMLHttpRequest.restore();
      // clock.restore();
    });
  });

  describe('user interactions for search activation', () => {
    beforeEach(() => {
      comp = createWrapper({ attachTo: document.body });
      vm = comp.vm;
    });

    it('toggle show/hides search input', () => {
      vm.toggle();
      expect(vm.hideSearch).to.equal(false);
      vm.toggle();
      expect(vm.hideSearch).to.equal(true);
    });

    it('button click should toggle search input visibility', async () => {
      // Two subwidgets
      const button = comp.findComponent({ name: 'v-btn' });
      const comboBox = comp.findComponent({ name: 'v-combobox' });

      // Initial state
      expect(vm.hideSearch).to.equal(true);
      expect(comboBox.isVisible()).to.equal(false);

      // Make visible
      await button.trigger('click');

      expect(vm.hideSearch).to.equal(false);
      expect(comboBox.isVisible()).to.equal(true);

      // And hide
      await button.trigger('click');

      expect(vm.hideSearch).to.equal(true);
      expect(comboBox.isVisible()).to.equal(false);
    });

    it('search input string should trigger search', done => {
      const queryString = 'heerstrasse 52 bonn';
      // Trigger watcher for search input string in combobox
      const comboBox = comp.findComponent({ name: 'v-combobox' });
      comboBox.vm.$emit('update:search', queryString);
      vm.$nextTick(() => {
        expect(vm.lastQueryStr).to.equal(queryString);
        done();
      });
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
