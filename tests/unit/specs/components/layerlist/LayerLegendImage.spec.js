import { shallowMount } from '@vue/test-utils';
import LayerLegendImage from '@/components/layerlist/LayerLegendImage';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWmsSource from 'ol/source/TileWMS';
import View from 'ol/View';

const osmLayer = new TileLayer({
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

describe('layerlist/LayerLegendImage.vue', () => {
  it('is defined', () => {
    expect(LayerLegendImage).to.not.be.an('undefined');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerLegendImage, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(vm.mapView).to.equal(view);
      expect(vm.layer).to.equal(osmLayer);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerLegendImage, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.viewResolutionChanged).to.be.a('function');
      expect(vm.resolution).to.equal(view.getResolution());
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('computed properties', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerLegendImage, {
        propsData: moduleProps
      });
      vm = comp.vm;
    });

    it('has no legendURL for OSM', () => {
      expect(vm.legendURL).to.be.undefined;
    });

    it('has correct legendURL for static legend URL', async () => {
      const layer = new TileLayer({
        source: new OSM(),
        legendUrl: 'http://my-image.png'
      });

      await comp.setProps({ layer: layer });
      expect(vm.legendURL).to.equal('http://my-image.png');
    });

    it('has correct legendURL for legend format URL', async () => {
      const layer = new TileLayer({
        source: new OSM(),
        legendUrl: 'http://my-image.png?transparent={{TRANSPARENT}}&width={{WIDTH}}&SCALE={{SCALE}}&language={{LANGUAGE}}',
        legendOptions: {
          transparent: true,
          width: 14
        }
      });
      await comp.setProps({ layer: layer });
      expect(vm.legendURL).to.equal('http://my-image.png?transparent=true&width=14&SCALE=139770566.00717944&language=en');
    });

    it('has correct legendURL for WMS', async () => {
      await comp.setProps({ layer: wmsLayer });
      expect(vm.legendURL).to.equal('https://ahocevar.com/geoserver/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=topp%3Astates&' +
        'SCALE=139770566.00717944&language=en');
    });

    it('legendURL supports localization and scale', async () => {
      await comp.setProps({ layer: wmsLayer });
      expect(vm.legendURL).to.equal('https://ahocevar.com/geoserver/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=topp%3Astates&' +
        'SCALE=139770566.00717944&language=en');

      vm.$i18n.locale = 'de';
      expect(vm.legendURL).to.equal('https://ahocevar.com/geoserver/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=topp%3Astates&' +
        'SCALE=139770566.00717944&language=de');

      view.setResolution(1000.0);
      expect(vm.legendURL).to.equal('https://ahocevar.com/geoserver/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=topp%3Astates&' +
        'SCALE=3571428.571428572&language=de');
    })

    afterEach(() => {
      comp.destroy();
    });
  });
});
