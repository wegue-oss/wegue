import MapOverlay from '@/components/modulecore/MapOverlay'
import { WguEventBus } from '@/WguEventBus'
import OlMap from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { shallowMount } from '@vue/test-utils';

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
}

describe('modulecore/MapOverlay.vue', () => {
  it('is defined', () => {
    expect(MapOverlay).to.not.be.an('undefined');
  });

  it('has a created hook', () => {
    expect(MapOverlay.created).to.be.a('function');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(MapOverlay, {
        propsData: overlayProps
      });
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
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(MapOverlay, {
        propsData: overlayProps
      });
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.show).to.equal(true);
      expect(vm.position).to.be.an('undefined');
      expect(vm.olOverlay).to.equal(null);
      expect(vm.contentData).to.equal(null);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(MapOverlay, {
        propsData: overlayProps
      });
      vm = comp.vm;
      vm.map = new OlMap({});
      vm.onMapBound();
    });

    it('createOlOverlay adds an OL overlay to map', () => {
      vm.createOlOverlay();

      expect(vm.olOverlay).to.not.be.an('undefined');
      expect(vm.olOverlay.getMap()).to.equal(vm.map);
      expect(vm.olOverlay.getElement()).to.equal(vm.$refs.overlayContainer);
      expect(vm.olOverlay.getId()).to.equal('my-overlay');
      expect(vm.olOverlay.getOffset()).to.eql([0, 0]);
      expect(vm.olOverlay.getPosition()).to.be.an('undefined');
      expect(vm.olOverlay.getPositioning()).to.equal('top-left');
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('watchers', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(MapOverlay, {
        propsData: overlayProps
      });
      vm = comp.vm;
      vm.map = new OlMap({});
      vm.onMapBound();
    });

    it('watches show', done => {
      expect(vm.show).to.equal(true);
      expect(vm.olOverlay).to.not.be.an('undefined');

      vm.show = false;
      vm.$nextTick(() => {
        expect(vm.olOverlay).to.be.an('undefined');
        done();
      });
    });

    it('watches position', done => {
      expect(vm.olOverlay.getPosition()).to.be.an('undefined');

      vm.position = coordinate;
      vm.$nextTick(() => {
        expect(vm.olOverlay.getPosition()).to.eql(coordinate);
        done();
      });
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('events', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(MapOverlay, {
        propsData: overlayProps
      });
      vm = comp.vm;
      vm.map = new OlMap({});
      vm.onMapBound();
    });

    it('update-overlay event creates, positions and populates overlay', done => {
      vm.show = false;
      vm.$nextTick(() => {
        expect(vm.olOverlay).to.be.an('undefined');

        WguEventBus.$emit('my-overlay-update-overlay', true, coordinate, contentData);
        vm.$nextTick(() => {
          expect(vm.olOverlay).to.not.be.an('undefined');
          expect(vm.olOverlay.getPosition()).to.eql(coordinate);
          expect(vm.show).to.equal(true);
          expect(vm.contentData).to.equal(contentData);
          done();
        });
      });
    });

    it('update-overlay event destroys overlay', done => {
      vm.show = true;
      vm.$nextTick(() => {
        expect(vm.olOverlay).to.not.be.an('undefined');

        WguEventBus.$emit('my-overlay-update-overlay', false);
        vm.$nextTick(() => {
          expect(vm.olOverlay).to.be.an('undefined');
          expect(vm.show).to.equal(false);
          done();
        });
      });
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
