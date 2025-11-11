import { nextTick, toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { bindMap, unbindMap } from '@/composables/Map';
import MapOverlay from '@/components/modulecore/MapOverlay.vue';
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
  let map;

  it('is defined', () => {
    expect(MapOverlay).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(MapOverlay.setup).to.be.a('function');
  });

  it('has a created hook', () => {
    expect(MapOverlay.created).to.be.a('function');
  });

  it('has an unmounted hook', () => {
    expect(MapOverlay.unmounted).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.visible).to.be.true;
      expect(vm.offset).to.be.undefined;
      expect(vm.positioning).to.equal('top-left');
      expect(vm.coordinates).to.be.undefined;
      expect(vm.autoPan).to.be.false;
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
      expect(vm.show).to.be.true;
      expect(vm.position).to.be.undefined;
      expect(vm.olOverlay).to.be.undefined;
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

      map = new OlMap({});
      bindMap(map);
    });

    it('createOlOverlay adds an OL overlay to map', () => {
      vm.createOlOverlay();

      expect(vm.olOverlay).to.not.be.undefined;
      expect(toRaw(vm.olOverlay.getMap())).to.equal(vm.map);
      expect(vm.olOverlay.getElement()).to.equal(vm.$refs.overlayContainer);
      expect(vm.olOverlay.getId()).to.equal('my-overlay');
      expect(vm.olOverlay.getOffset()).to.eql([0, 0]);
      expect(vm.olOverlay.getPosition()).to.be.undefined;
      expect(vm.olOverlay.getPositioning()).to.equal('top-left');
    });

    afterEach(() => {
      unbindMap();
      map = undefined;

      comp.unmount();
    });
  });

  describe('watchers', () => {
    beforeEach(async () => {
      comp = createWrapper();
      vm = comp.vm;

      map = new OlMap({});
      bindMap(map);
      await nextTick();
    });

    it('watches show', async () => {
      expect(vm.show).to.be.true;
      expect(vm.olOverlay).to.not.be.undefined;

      vm.show = false;
      await nextTick();

      expect(vm.olOverlay).to.be.undefined;
    });

    it('watches position', async () => {
      expect(vm.olOverlay.getPosition()).to.be.undefined;

      vm.position = coordinate;
      await nextTick();

      expect(vm.olOverlay.getPosition()).to.eql(coordinate);
    });

    afterEach(() => {
      unbindMap();
      map = undefined;

      comp.unmount();
    });
  });

  describe('events', () => {
    beforeEach(async () => {
      comp = createWrapper();
      vm = comp.vm;

      map = new OlMap({});
      bindMap(map);
      await nextTick();
    });

    it('update-overlay event creates, positions and populates overlay', async () => {
      vm.show = false;
      await nextTick();

      expect(vm.olOverlay).to.be.undefined;

      WguEventBus.$emit('my-overlay-update-overlay', true, coordinate, contentData);
      await nextTick();

      expect(vm.olOverlay).to.not.be.undefined;
      expect(vm.olOverlay.getPosition()).to.eql(coordinate);
      expect(vm.show).to.be.true;
      expect(toRaw(vm.contentData)).to.equal(contentData);
    });

    it('update-overlay event destroys overlay', async () => {
      vm.show = true;
      await nextTick();

      expect(vm.olOverlay).to.not.be.undefined;

      WguEventBus.$emit('my-overlay-update-overlay', false);
      await nextTick();

      expect(vm.olOverlay).to.be.undefined;
      expect(vm.show).to.be.false;
    });

    afterEach(() => {
      unbindMap();
      map = undefined;

      comp.unmount();
    });
  });
});
