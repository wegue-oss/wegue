import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import Map from '@/components/ol/Map';
import OlMap from 'ol/Map';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import SelectInteraction from 'ol/interaction/Select';

describe('ol/Map.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof Map).to.not.equal('undefined');
  });

  it('has a mounted hook', () => {
    expect(typeof Map.mounted).to.equal('function');
  });

  it('has a created hook', () => {
    expect(typeof Map.created).to.equal('function');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      Vue.prototype.$appConfig = {modules: {}};
      comp = shallowMount(Map);
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.color).to.equal('red darken-3');
      expect(vm.collapsibleAttribution).to.equal(false);
      expect(vm.rotateableMap).to.equal(false);
    });
  });

  describe('data', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(Map);
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.zoom).to.equal(undefined);
      expect(vm.center).to.equal(undefined);
    });

    it('has correct default data', () => {
      expect(vm.zoom).to.equal(undefined);
      expect(vm.center).to.equal(undefined);
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(Map);
      vm = comp.vm;
    });

    it('createLayers returns always an array', async () => {
      // mock a map layer config
      Vue.prototype.$appConfig = {mapLayers: [{
        'type': 'OSM',
        'lid': 'osm-bg',
        'name': 'OSM',
        'isBaseLayer': false,
        'visible': true,
        'selectable': false,
        'displayInLayerList': true}]
      };
      const layers = await vm.createLayers();
      expect(layers).to.be.an('array');
      expect(layers.length).to.equal(1);
    });

    it('createLayers expands LAYERCOLLECTION Layer type', async () => {
      // mock a map layer config
      Vue.prototype.$appConfig = {mapLayers: [{
        'type': 'OSM',
        'lid': 'osm-bg',
        'name': 'OSM',
        'isBaseLayer': false,
        'visible': true,
        'selectable': false,
        'displayInLayerList': true}, {
        'type': 'LAYERCOLLECTION',
        // should change URL to Wegue GH when ready
        'url': 'https://raw.githubusercontent.com/Geolicious/wegue/111-dynlayers-wegueformat/static/layer-collection.json'}]
      };
      const layers = await vm.createLayers();
      expect(layers).to.be.an('array');
      // OSM (1 layer) and LAYERCOLLECTION (2 layers)
      expect(layers.length).to.equal(3);
    });

    it('createLayers registers a select interaction if configured', async () => {
      // mock a map layer config
      Vue.prototype.$appConfig = {mapLayers: [{
        'type': 'OSM',
        'lid': 'osm-bg',
        'name': 'OSM',
        'isBaseLayer': false,
        'visible': true,
        'selectable': true,
        'displayInLayerList': true}]
      };
      await vm.createLayers();
      let selectIa;
      vm.map.getInteractions().forEach((ia) => {
        if (ia instanceof SelectInteraction) {
          selectIa = ia;
        }
      });
      expect(typeof selectIa).to.not.equal('undefined');
    });

    it('setOlButtonColor applies CSS color to OL buttons', () => {
      // mock a OL zoom button
      const mockZoomDiv = document.createElement('div');
      const mockSubZoomInEl = document.createElement('button');
      const mockSubZoomOutEl = document.createElement('button');
      mockZoomDiv.classList.add('ol-zoom');
      mockSubZoomInEl.classList.add('ol-zoom-in');
      mockSubZoomOutEl.classList.add('ol-zoom-out');
      mockZoomDiv.append(mockSubZoomInEl);
      mockZoomDiv.append(mockSubZoomOutEl);
      document.body.append(mockZoomDiv);

      // mock a OL rotate button
      const mockRotDiv = document.createElement('div');
      const mockSubRotDiv = document.createElement('div');
      mockRotDiv.classList.add('ol-rotate');
      mockSubRotDiv.classList.add('ol-rotate-reset');
      mockRotDiv.append(mockSubRotDiv);
      document.body.append(mockRotDiv);

      vm.color = 'rgb(0, 0, 0)';
      vm.setOlButtonColor();

      expect(mockSubZoomInEl.style.backgroundColor).to.equal(vm.color);
      expect(mockSubZoomOutEl.style.backgroundColor).to.equal(vm.color);
      expect(mockSubRotDiv.style.backgroundColor).to.equal(vm.color);

      // cleanup (otherwise follow up tests fail)
      mockZoomDiv.parentNode.removeChild(mockZoomDiv);
      mockRotDiv.parentNode.removeChild(mockRotDiv);
    });

    it('setOlButtonColor applies Vuetify color to OL buttons', () => {
      // mock a OL zoom button
      const mockZoomDiv = document.createElement('div');
      const mockSubZoomInEl = document.createElement('button');
      const mockSubZoomOutEl = document.createElement('button');
      mockZoomDiv.classList.add('ol-zoom');
      mockSubZoomInEl.classList.add('ol-zoom-in');
      mockSubZoomOutEl.classList.add('ol-zoom-out');
      mockZoomDiv.append(mockSubZoomInEl);
      mockZoomDiv.append(mockSubZoomOutEl);
      document.body.append(mockZoomDiv);

      // mock a OL rotate button
      var mockRotDiv = document.createElement('div');
      var mockSubRotEl = document.createElement('button');
      mockRotDiv.classList.add('ol-rotate');
      mockSubRotEl.classList.add('ol-rotate-reset');
      mockRotDiv.append(mockSubRotEl);
      document.body.append(mockRotDiv);

      // set a vuetify color definition like 'red darken-3'
      const cssCls1 = 'red';
      const cssCls2 = 'darken-3';
      vm.color = cssCls1 + ' ' + cssCls2;
      vm.setOlButtonColor();

      expect(mockSubZoomInEl.classList.contains(cssCls1)).to.equal(true);
      expect(mockSubZoomInEl.classList.contains(cssCls2)).to.equal(true);
      expect(mockSubZoomOutEl.classList.contains(cssCls1)).to.equal(true);
      expect(mockSubZoomOutEl.classList.contains(cssCls2)).to.equal(true);
      expect(mockSubRotEl.classList.contains(cssCls1)).to.equal(true);
      expect(mockSubRotEl.classList.contains(cssCls2)).to.equal(true);

      // cleanup (otherwise follow up tests fail)
      mockZoomDiv.parentNode.removeChild(mockZoomDiv);
      mockRotDiv.parentNode.removeChild(mockRotDiv);
    });

    it('setupMapHover registers a tooltip DOM element and OL overlay', () => {
      const map = new OlMap({});
      const mockMapDiv = document.createElement('div');
      map.setTarget(mockMapDiv);
      vm.map = map;

      vm.setupMapHover();

      const hoverOverlayEl = vm.map.getTarget().querySelector('.wgu-hover-tooltiptext');
      expect(typeof hoverOverlayEl).not.to.equal('undefined');

      expect(map.getOverlays().getLength()).to.equal(1);
    });

    it('setupMapHover binds a pointermove and shows no tooltip if no feature is hit', () => {
      const map = new OlMap({});
      const mockMapDiv = document.createElement('div');
      map.setTarget(mockMapDiv);
      vm.map = map;

      vm.setupMapHover();
      vm.onPointerMove({pixel: [0, 0]});

      expect(vm.overlayEl.innerHTML).to.equal('');
      expect(vm.overlay.getPosition()).to.equal(undefined);
    });

    it('setupMapHover binds a pointermove and shows correct tooltip', () => {
      const feat = new Feature({
        foo: 'bar',
        geometry: new Point([0, 0])
      });
      const layer = new VectorLayer({
        hoverable: true,
        hoverAttribute: 'foo',
        source: new VectorSource({
          features: [feat]
        })
      });
      const map = new OlMap({
        layers: [layer]
      });
      const mockMapDiv = document.createElement('div');
      map.setTarget(mockMapDiv);

      // overwrite getFeaturesAtPixel to simulate hitting a valid feature
      map.getFeaturesAtPixel = (evt, opts) => {
        opts.layerFilter(layer);
        return [feat];
      };

      vm.map = map;

      vm.setupMapHover();

      vm.onPointerMove({pixel: [0, 0]});

      expect(vm.overlayEl.innerHTML).to.equal('bar');
      expect(vm.overlay.getPosition()).to.equal(undefined);
    });
  });
});
