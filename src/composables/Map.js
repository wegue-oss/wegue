import { ref, shallowRef, computed } from 'vue';

/**
 * Composable which encapsulate OL map management.
 */
const map = shallowRef();
const layers = ref([]);

/**
 * Init function of the composable.
 * This should be called by the component responsible for map creation to
 * enable map and layers reactivity.
 */
export function bindMap (olMap) {
  map.value = olMap;
  layers.value = map.value.getLayers().getArray();

  map.value.getLayers().on('change:length', (event) => {
    layers.value = [...event.target.getArray()];
  });
};

/**
 * Cleanup function of the composable.
 * This should be called by the component responsible for map management to
 * disable map and layers reactivity.
 */
export function unbindMap () {
  layers.value = [];
  map.value = undefined;
};

/**
 * Main composable function to be called by components to get references
 * to the map and/or layers.
 */
export function useMap () {
  return {
    map: computed(() => map.value),
    layers: computed(() => {
      return layers.value;
    })
  };
};
