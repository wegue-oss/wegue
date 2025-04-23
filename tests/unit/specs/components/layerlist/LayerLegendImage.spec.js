import { toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import LayerLegendImage from '@/components/layerlist/LayerLegendImage';
import i18nMessages from '@/locales/en.json';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWmsSource from 'ol/source/TileWMS';
import View from 'ol/View';

const osmLayer = new TileLayer({
  lid: 'osm',
  source: new OSM()
});

const wmsLayer = new TileLayer({
  lid: 'ahocevar-wms',
  source: new TileWmsSource({
    url: 'https://ahocevar.com/geoserver/wms',
    params: {
      LAYERS: 'topp:states',
      TILED: true
    }
  })
});

const view = new View({
  projection: 'EPSG:3857',
  center: [0, 0],
  zoom: 2
});

const moduleProps = {
  mapView: view,
  layer: osmLayer
};

function createWrapper (props = moduleProps) {
  const i18nInstance = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en: i18nMessages },
    missingWarn: false,
    fallbackWarn: false,
    warnHtmlMessage: false
  });

  return shallowMount(LayerLegendImage, {
    props,
    attachTo: document.body,
    global: {
      plugins: [i18nInstance]
    }
  });
}

describe('layerlist/LayerLegendImage.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(LayerLegendImage).to.not.be.an('undefined');
  });

  it('has a created hook', () => {
    expect(LayerLegendImage.created).to.be.a('function');
  });

  it('has an unmounted hook', () => {
    expect(LayerLegendImage.unmounted).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(toRaw(vm.mapView)).to.equal(view);
      expect(toRaw(vm.layer)).to.equal(osmLayer);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.viewResolutionChanged).to.be.a('function');
      expect(vm.resolution).to.equal(view.getResolution());
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('computed properties', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has no legendURL for OSM', () => {
      expect(vm.legendURL).to.be.undefined;
    });

    it('has correct legendURL for static legend URL', async () => {
      const layer = new TileLayer({
        lid: 'osm2',
        source: new OSM(),
        legendUrl: 'http://my-image.png'
      });
      await comp.setProps({ layer });

      expect(vm.legendURL).to.equal('http://my-image.png');
    });

    it('has correct legendURL for legend format URL', async () => {
      const layer = new TileLayer({
        lid: 'osm2',
        source: new OSM(),
        legendUrl: 'http://my-image.png?transparent={{TRANSPARENT}}&width={{WIDTH}}&SCALE={{SCALE}}&language={{LANGUAGE}}',
        legendOptions: {
          transparent: true,
          width: 14
        }
      });
      await comp.setProps({ layer });

      expect(vm.legendURL).to.equal('http://my-image.png?transparent=true&width=14&SCALE=139770566.00717944&language=en');
    });

    it('has correct legendURL for WMS', async () => {
      await comp.setProps({ layer: wmsLayer });
      expect(vm.legendURL).to.equal('https://ahocevar.com/geoserver/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=topp%3Astates&' +
        'SCALE=139770566.00717944&language=en&SLD_VERSION=1.1.0');
    });

    it('legendURL supports localization and scale', async () => {
      await comp.setProps({ layer: wmsLayer });

      expect(vm.legendURL).to.equal('https://ahocevar.com/geoserver/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=topp%3Astates&' +
        'SCALE=139770566.00717944&language=en&SLD_VERSION=1.1.0');

      vm.$i18n.locale = 'de';

      expect(vm.legendURL).to.equal('https://ahocevar.com/geoserver/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=topp%3Astates&' +
        'SCALE=139770566.00717944&language=de&SLD_VERSION=1.1.0');

      view.setResolution(1000.0);

      expect(vm.legendURL).to.equal('https://ahocevar.com/geoserver/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=topp%3Astates&' +
        'SCALE=3571428.571428572&language=de&SLD_VERSION=1.1.0');
    });

    afterEach(() => {
      vm.$i18n.locale = 'en';
      comp.unmount();
    });
  });
});
