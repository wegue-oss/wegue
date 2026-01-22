import { shallowRef, computed } from 'vue';
import { LayerCollectionProxy } from '@/util/Layer';

/**
 * Composable which encapsulate OL map management.
 */
const map = shallowRef();
const layers = shallowRef();

/**
 * Init function of the composable.
 * This should be called by the component responsible for map creation to
 * enable map and layers reactivity.
 */
export function bindMap (olMap) {
  map.value = olMap;
  layers.value = new LayerCollectionProxy(olMap.getLayers());
};

/**
 * Cleanup function of the composable.
 * This should be called by the component responsible for map management to
 * disable map and layers reactivity.
 */
export function unbindMap () {
  if (layers.value) {
    layers.value.destroy();
    layers.value = undefined;
  }
  map.value = undefined;
};

/**
 * Main composable function to be called by components to get references
 * to the map and/or layers.
 */
export function useMap () {
  return {
    map: computed(() => map.value),
    layers: computed(() => layers.value)
  };
};
