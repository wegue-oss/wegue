import { nextTick, toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import MapOverlay from '@/components/modulecore/MapOverlay';
import { WguEventBus } from '@/WguEventBus';
import OlMap from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

// Common test data
const overlayProps = {
  overlayId: 'my-overlay'
};
const coordinate = [1, 1];
const contentData = {
  feature: new Feature({
    foo: 'bar',
    geometry: new Point([0, 0])
  }),
  hoverAttribute: 'foo'
};

function createWrapper (props = overlayProps) {
  return shallowMount(MapOverlay, {
    props
  });
}

describe('modulecore/MapOverlay.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(MapOverlay).to.not.be.an('undefined');
  });

  it('has a created hook', () => {
    expect(MapOverlay.created).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.visible).to.equal(true);
      expect(vm.offset).to.be.an('undefined');
      expect(vm.positioning).to.equal('top-left');
      expect(vm.coordinates).to.be.an('undefined');
      expect(vm.autoPan).to.equal(false);
      expect(vm.autoPanDuration).to.equal(0);
    });

    it('has correct props', () => {
      expect(vm.overlayId).to.equal('my-overlay');
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
      expect(vm.show).to.equal(true);
      expect(vm.position).to.be.an('undefined');
      expect(vm.olOverlay).to.equal(null);
      expect(toRaw(vm.contentData)).to.deep.equal({});
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
      vm.map = new OlMap({});
      vm.onMapBound();
    });

    it('createOlOverlay adds an OL overlay to map', () => {
      vm.createOlOverlay();

      expect(vm.olOverlay).to.not.be.an('undefined');
      expect(toRaw(vm.olOverlay.getMap())).to.equal(vm.map);
      expect(vm.olOverlay.getElement()).to.equal(vm.$refs.overlayContainer);
      expect(vm.olOverlay.getId()).to.equal('my-overlay');
      expect(vm.olOverlay.getOffset()).to.eql([0, 0]);
      expect(vm.olOverlay.getPosition()).to.be.an('undefined');
      expect(vm.olOverlay.getPositioning()).to.equal('top-left');
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('watchers', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
      vm.map = new OlMap({});
      vm.onMapBound();
    });

    it('watches show', async () => {
      expect(vm.show).to.equal(true);
      expect(vm.olOverlay).to.not.be.an('undefined');

      vm.show = false;
      await nextTick();

      expect(vm.olOverlay).to.be.an('undefined');
    });

    it('watches position', async () => {
      expect(vm.olOverlay.getPosition()).to.be.an('undefined');

      vm.position = coordinate;
      await nextTick();

      expect(vm.olOverlay.getPosition()).to.eql(coordinate);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('events', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
      vm.map = new OlMap({});
      vm.onMapBound();
    });

    it('update-overlay event creates, positions and populates overlay', async () => {
      vm.show = false;
      await nextTick();

      expect(vm.olOverlay).to.be.an('undefined');

      WguEventBus.$emit('my-overlay-update-overlay', true, coordinate, contentData);
      await nextTick();

      expect(vm.olOverlay).to.not.be.an('undefined');
      expect(vm.olOverlay.getPosition()).to.eql(coordinate);
      expect(vm.show).to.equal(true);
      expect(toRaw(vm.contentData)).to.equal(contentData);
    });

    it('update-overlay event destroys overlay', async () => {
      vm.show = true;
      await nextTick();

      expect(vm.olOverlay).to.not.be.an('undefined');

      WguEventBus.$emit('my-overlay-update-overlay', false);
      await nextTick();

      expect(vm.olOverlay).to.be.an('undefined');
      expect(vm.show).to.equal(false);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
