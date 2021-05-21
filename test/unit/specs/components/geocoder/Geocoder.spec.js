import { shallowMount } from '@vue/test-utils';
import Geocoder from '@/components/geocoder/Geocoder';
import {OpenStreetMap} from '../../../../../src/components/geocoder/providers/osm';
import {Photon} from '../../../../../src/components/geocoder/providers/photon';
import {OpenCage} from '../../../../../src/components/geocoder/providers/opencage';
import OlMap from 'ol/Map';
import {fromLonLat} from 'ol/proj';
// import * as sinon from 'sinon';

describe('geocoder/Geocoder.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof Geocoder).to.not.equal('undefined');
  });

  it('has a mounted hook', () => {
    expect(typeof Geocoder.mounted).to.equal('function');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(Geocoder);
    });

    it('has correct default props', () => {
      expect(comp.vm.icon).to.equal('search');
      expect(comp.vm.rounded).to.equal(true);
      expect(comp.vm.autofocus).to.equal(true);
      expect(comp.vm.dark).to.equal(false);
      expect(comp.vm.persistentHint).to.equal(true);
    });
  });

  describe('default data and Provider', () => {
    let comp;
    let vm;

    beforeEach(() => {
      comp = shallowMount(Geocoder);
      vm = comp.vm;
    });

    it('has correct default data and Provider', () => {
      expect(vm.hideSearch).to.equal(true);
      expect(vm.minChars).to.equal(3);
      expect(vm.queryDelay).to.equal(300);
      expect(vm.selectZoom).to.equal(16);
      expect(vm.placeHolder).to.equal('Search for an address');
      expect(vm.geocoderController !== undefined).to.equal(true);
      expect(vm.geocoderController.provider instanceof OpenStreetMap).to.equal(true);
    });
  });

  describe('configured data and Provider - Photon', () => {
    let comp;
    let vm;

    beforeEach(() => {
      const moduleProps = {
        'target': 'toolbar',
        'darkLayout': true,
        'minChars': 5,
        'queryDelay': 200,
        'selectZoom': 17,
        'debug': false,
        'placeHolder': 'Search',
        'provider': 'photon'
      };
      comp = shallowMount(Geocoder, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct configured data and Provider', () => {
      expect(vm.hideSearch).to.equal(true);
      expect(vm.minChars).to.equal(5);
      expect(vm.queryDelay).to.equal(200);
      expect(vm.selectZoom).to.equal(17);
      expect(vm.placeHolder).to.equal('Search');
      expect(vm.geocoderController !== undefined).to.equal(true);
      expect(vm.geocoderController.provider instanceof Photon).to.equal(true);
    });
  });

  describe('configured data and Provider - OpenCage', () => {
    let comp;
    let vm;

    beforeEach(() => {
      const moduleProps = {
        'target': 'toolbar',
        'darkLayout': true,
        'minChars': 6,
        'queryDelay': 200,
        'selectZoom': 15,
        'debug': false,
        'placeHolder': 'Search',
        'provider': 'opencage'
      };
      comp = shallowMount(Geocoder, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct configured data and Provider', () => {
      expect(vm.hideSearch).to.equal(true);
      expect(vm.minChars).to.equal(6);
      expect(vm.queryDelay).to.equal(200);
      expect(vm.selectZoom).to.equal(15);
      expect(vm.placeHolder).to.equal('Search');
      expect(vm.geocoderController !== undefined).to.equal(true);
      expect(vm.geocoderController.provider instanceof OpenCage).to.equal(true);
    });
  });

  describe('methods - search', () => {
    let comp;
    let vm;
    // let fakeXhr;
    // let clock;
    // let requests = [];
    const queryString = 'Heerstraße 52 bonn';
    let selectionItems;
    const selectZoom = 15;

    beforeEach(() => {
      const moduleProps = {
        'target': 'toolbar',
        'queryDelay': 2,
        'selectZoom': selectZoom,
        'provider': 'osm'
      };
      comp = shallowMount(Geocoder, {
        propsData: moduleProps
      });
      vm = comp.vm;

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

    it('search watcher assigns last query string', done => {
      vm.search = queryString;
      vm.$nextTick(() => {
        expect(vm.lastQueryStr === queryString).to.equal(true);
        done();
      });
    });

    it('search watcher query with results', done => {
      vm.search = queryString;
      vm.$nextTick(() => {
        expect(vm.lastQueryStr === queryString).to.equal(true);

        // We do a timeout, to beat setTimeout() with async query in Geocoder
        // TODO find a more elegant way. sinon.useFakeTimers did not work for us.
        setTimeout(function () {
          expect(vm.results === undefined).to.equal(false);
          expect(vm.results.length > 0).to.equal(true);
          expect(vm.results[0].address.road === 'Heerstraße').to.equal(true);

          // Items from query result should be assigned to combobox
          const comboBox = comp.findComponent({name: 'v-combobox'});
          selectionItems = comboBox.vnode.data.attrs.items;
          expect(selectionItems === undefined).to.equal(false);
          expect(selectionItems.length === vm.results.length).to.equal(true);
          done();
        }, 1800);
      });
    });

    it('select items watcher assigns result and zooms/centers Map at result', done => {
      vm.map = new OlMap();
      vm.selected = selectionItems[0];
      vm.$nextTick(() => {
        // Map center should be at coordinates from selected item
        const mapCenter = vm.map.getView().getCenter();

        // Map may have different projection than WGS84
        const coords = fromLonLat(
          [selectionItems[0].value.lon, selectionItems[0].value.lat],
          vm.map.getView().getProjection());
        expect(mapCenter[0] === coords[0]);
        expect(mapCenter[1] === coords[1]);
        expect(selectZoom === vm.map.getView().getZoom());
        done();
      });
    });

    afterEach(function () {
      // Like before we must clean up when tampering with globals.
      // global.XMLHttpRequest.restore();
      // clock.restore();
    });
  });

  describe('user interactions for search activation', () => {
    let comp;
    let vm;

    beforeEach(() => {
      comp = shallowMount(Geocoder);
      vm = comp.vm;
    });

    it('toggle show/hides search input', () => {
      vm.toggle();
      expect(vm.hideSearch).to.equal(false);
      vm.toggle();
      expect(vm.hideSearch).to.equal(true);
    });

    it('button click should toggle search input visibility', done => {
      // Two subwidgets
      const button = comp.findComponent({name: 'v-btn'});
      const comboBox = comp.findComponent({name: 'v-combobox'});

      // Initial state
      expect(vm.hideSearch).to.equal(true);
      expect(comboBox.attributes('hidden')).to.equal('true');

      // Make visible
      button.vm.$emit('click');
      vm.$nextTick(() => {
        expect(vm.hideSearch).to.equal(false);
        // So looks like the 'hidden' attr is simply removed/added through toggle()!
        expect(comboBox.attributes('hidden')).to.equal(undefined);

        // And hide
        button.vm.$emit('click');
        vm.$nextTick(() => {
          expect(vm.hideSearch).to.equal(true);
          expect(comboBox.attributes('hidden')).to.equal('true');
          done();
        });
      });
    });

    it('search input string should trigger search', done => {
      const queryString = 'heerstrasse 52 bonn';
      // Trigger watcher for search input string in combobox
      vm.search = queryString;
      vm.$nextTick(() => {
        expect(vm.lastQueryStr).to.equal(queryString);
        done();
      });
    });
  });
});
