import { nextTick } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { bindMap, unbindMap } from '@/composables/Map';
import MapLoadingStatus from '@/components/progress/MapLoadingStatus';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import MapEvent from 'ol/MapEvent';
import MapEventType from 'ol/MapEventType';

function createWrapper () {
  return shallowMount(MapLoadingStatus);
};

describe('progress/MapLoadingStatus.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(MapLoadingStatus).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(MapLoadingStatus.setup).to.be.a('function');
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.visible).to.be.false;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('events', () => {
    let map;

    beforeEach(() => {
      map = new OlMap({
        view: new OlView({
          center: [0, 0],
          zoom: 1
        }),
        layers: []
      });

      comp = shallowMount(MapLoadingStatus);
      vm = comp.vm;
      bindMap(map);
    });

    it('hides the circular progress when mounted', done => {
      // Let time for map to be bound
      setTimeout(() => {
        try {
          const circularProgress = comp.findComponent({ name: 'v-progress-circular' });
          expect(circularProgress.exists(), 'Circular progress should not be visible').to.be.false;
          done();
        } catch (error) {
          done(error);
        }
      }, 100);
    });

    it('shows the circular progress when map starts loading data', done => {
      const frameState = {
        layerStatesArray: []
      };

      // Let time for map to be bound
      setTimeout(() => {
        map.on('loadstart', async () => {
          nextTick(() => {
            nextTick(() => {
              try {
                const circularProgress = comp.findComponent({ name: 'v-progress-circular' });
                expect(circularProgress.exists(), 'Circular progress should be visible').to.be.true;
                done();
              } catch (error) {
                done(error);
              }
            });
          })
        });

        map.dispatchEvent(new MapEvent(MapEventType.LOADSTART, map, frameState))
      }, 100);
    });

    it('hides the circular progress when map has finished loading data', done => {
      const frameState = {
        layerStatesArray: []
      };

      // Let time for map to be bound
      setTimeout(() => {
        map.on('loadstart', async () => {
          nextTick(() => {
            nextTick(() => {
              try {
                const circularProgress = comp.findComponent({ name: 'v-progress-circular' });
                expect(circularProgress.exists(), 'Circular progress should be visible').to.be.true;

                // Send event that should hide the Map Loading Status component
                map.dispatchEvent(new MapEvent(MapEventType.LOADEND, map, frameState));
              } catch (error) {
                done(error);
              }
            });
          });
        });

        map.on('loadend', () => {
          nextTick(() => {
            nextTick(() => {
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
        map.dispatchEvent(new MapEvent(MapEventType.LOADSTART, map, frameState))
      }, 100);
    });

    afterEach(() => {
      unbindMap();
      map = undefined;

      comp.unmount();
    });
  });
});
