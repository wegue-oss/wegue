import { ref, shallowRef, computed } from 'vue';

const map = shallowRef();
const layers = ref([]);

/**
 * Composable for map
 */
export function bindMap (olMap) {
  map.value = olMap
  layers.value = map.value.getLayers().getArray()

  map.value.getLayers().on('change:length', (event) => {
    layers.value = [...event.target.getArray()]
  })
}

export function unbindMap () {
  layers.value = [];
  map.value = undefined;
}

export function useMap () {
  return {
    map: computed(() => map.value),
    layers: computed(() => {
      return layers.value
    })
  }
}
