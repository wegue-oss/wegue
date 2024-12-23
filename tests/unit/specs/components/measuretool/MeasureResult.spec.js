import { shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import i18nMessages from '@/locales/en.json';
import { bindMap, unbindMap } from '@/composables/Map';
import MeasureResult from '@/components/measuretool/MeasureResult';
import PolygonGeom from 'ol/geom/Polygon';
import LineStringGeom from 'ol/geom/LineString';
import Map from 'ol/Map';
import View from 'ol/View';

const olMap = new Map({
  view: new View({ center: [0, 0], zoom: 2 })
});

function createWrapper (assignMap = false) {
  const map = assignMap ? olMap : undefined;

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

  const wrapper = shallowMount(MeasureResult, {
    data () {
      return {
        map
      }
    },
    global: {
      mocks: {
        $t: (tKey, ...rest) => {
          return i18nInstance.global.t(tKey, ...rest);
        }
      },
      plugins: [i18nInstance]
    }
  });

  if (map) {
    bindMap(map);
  }
  return wrapper;
}

describe('measuretool/MeasureResult.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(MeasureResult).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(MeasureResult.setup).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.measureGeom).to.be.undefined;
      expect(vm.measureType).to.be.undefined;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data', () => {
    const EMPTY_RESULT_TEXT = ' -- ';

    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.area).to.equal(EMPTY_RESULT_TEXT);
      expect(vm.distance).to.equal(EMPTY_RESULT_TEXT);
      expect(vm.angle).to.equal(EMPTY_RESULT_TEXT);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      comp = createWrapper(true);
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(vm.formatLength).to.be.a('function');
      expect(vm.formatArea).to.be.a('function');
      expect(vm.formatAngle).to.be.a('function');
    });

    it('formatLength returns the correct formatted text for length', () => {
      const lineGeom = new LineStringGeom([[0, 0], [1000, 0], [1000, 1000], [0, 1000]]);
      const fLenText = vm.formatLength(lineGeom);

      expect(fLenText).to.equal('3 km');
    });

    it('formatArea returns the correct formatted text for area', () => {
      const polyGeom = new PolygonGeom([[[0, 0], [1000, 0], [1000, 1000], [0, 1000], [0, 0]]]);
      const fLenText = vm.formatArea(polyGeom);

      expect(fLenText).to.equal('1 km²');
    });

    it('formatAngle returns the correct formatted text for angle', () => {
      const lineGeom = new LineStringGeom([[0, 0], [1000, 1000]]);
      const fAngleText = vm.formatAngle(lineGeom);

      expect(fAngleText).to.equal('45.00°');
    });

    afterEach(() => {
      unbindMap();
      comp.unmount();
    });
  });

  describe('watchers', () => {
    beforeEach(() => {
      comp = createWrapper(true);
      vm = comp.vm;
    });

    it('watches measureGeom Area', async () => {
      const polyGeom = new PolygonGeom([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]);
      await comp.setProps({ measureGeom: { geom: polyGeom }, measureType: 'area' });

      expect(vm.area).to.equal('1 m²');
      expect(vm.distance).to.equal('4 m');
    });

    it('watches measureGeom Distance', async () => {
      const lineGeom = new LineStringGeom([[0, 0], [1, 0], [1, 1], [0, 1]]);
      await comp.setProps({ measureGeom: { geom: lineGeom }, measureType: 'distance' });

      expect(vm.distance).to.equal('3 m');
    });

    it('watches measureGeom Angle', async () => {
      const lineGeom = new LineStringGeom([[0, 0], [1, 0]]);
      await comp.setProps({ measureGeom: { geom: lineGeom }, measureType: 'angle' });

      expect(vm.angle).to.equal('90.00°');
    });

    it('watches measureGeom non supported geom', async () => {
      await comp.setProps({ measureGeom: { geom: null } });

      expect(vm.distance).to.equal(' -- ');
    });

    afterEach(() => {
      unbindMap();
      comp.unmount();
    });
  });
});
