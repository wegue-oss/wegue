import { shallowMount } from '@vue/test-utils';
import MapLoadingStatus from '@/components/progress/MapLoadingStatus';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import MapEvent from 'ol/MapEvent';
import MapEventType from 'ol/MapEventType';

describe('progress/MapLoadingStatus.vue', () => {
  it('is defined', () => {
    expect(typeof MapLoadingStatus).to.not.be.an('undefined');
  });

  describe('data', () => {
    let comp;

    beforeEach(() => {
      comp = shallowMount(MapLoadingStatus);
    });

    it('has correct default data', () => {
      expect(comp.vm.visible).to.be.false;
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('events', () => {
    let comp;
    let vm;

    beforeEach(() => {
      const olMap = new OlMap({
        view: new OlView({
          center: [0, 0],
          zoom: 1
        }),
        layers: []
      });

      comp = shallowMount(MapLoadingStatus);
      vm = comp.vm;
      vm.map = olMap;
      vm.onMapBound();
    });

    it('hides the circular progress when mounted', () => {
      const circularProgress = comp.findComponent({ name: 'v-progress-circular' });
      expect(circularProgress.exists(), 'Circular progress should not be visible').to.be.false;
    });

    it('shows the circular progress when map starts loading data', done => {
      const frameState = {
        layerStatesArray: []
      };

      vm.map.on('loadstart', () => {
        vm.$nextTick(() => {
          vm.$nextTick(() => {
            try {
              const circularProgress = comp.findComponent({ name: 'v-progress-circular' });
              expect(circularProgress.exists(), 'Circular progress should be visible').to.be.true;
              done();
            } catch (error) {
              done(error);
            }
          });
        });
      });

      vm.map.dispatchEvent(new MapEvent(MapEventType.LOADSTART, vm.map, frameState));
    });

    it('hides the circular progress when map has finished loading data', done => {
      const frameState = {
        layerStatesArray: []
      };

      vm.map.on('loadstart', () => {
        vm.$nextTick(() => {
          vm.$nextTick(() => {
            try {
              const circularProgress = comp.findComponent({ name: 'v-progress-circular' });
              expect(circularProgress.exists(), 'Circular progress should be visible').to.be.true;

              // Send event that should hide the Map Loading Status component
              vm.map.dispatchEvent(new MapEvent(MapEventType.LOADEND, vm.map, frameState));
            } catch (error) {
              done(error);
            }
          });
        });
      });

      vm.map.on('loadend', () => {
        vm.$nextTick(() => {
          vm.$nextTick(() => {
            try {
              const circularProgress = comp.findComponent({ name: 'v-progress-circular' });
              expect(circularProgress.exists(), 'Circular progress should be hidden').to.be.false;
              done();
            } catch (error) {
              done(error);
            }
          });
        });
      });

      // Send event that should display the Map Loading Status component
      vm.map.dispatchEvent(new MapEvent(MapEventType.LOADSTART, vm.map, frameState));
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
