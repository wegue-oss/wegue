<template>
  <v-progress-circular
    v-if="visible"
    class="wgu-maploading-status"
    :model-value="80"
    indeterminate
    color="secondary"
    >
  </v-progress-circular>
</template>

<script>
import { useMap } from '@/composables/Map';

export default {
  name: 'wgu-maploading-status',
  setup () {
    const { map, layers } = useMap(this);
    return { map, layers };
  },
  data () {
    return {
      visible: false
    }
  },
  watch: {
    map: {
      handler (newMap) {
        if (newMap) {
          this.onMapBound();
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * This function is executed, after the map is bound
     * and registers the current map layers.
     */
    onMapBound () {
      this.registerMapEvents();
    },

    /**
     * Registers the needed events on the map.
     */
    registerMapEvents () {
      this.map.on('loadstart', this.showLoader);
      this.map.on('loadend', this.hideLoader);
    },

    /**
     * Called whenever loading of map data starts.
     */
    showLoader () {
      this.visible = true;
    },

    /**
     * Called whenever loading of map data has ended.
     */
    hideLoader () {
      this.visible = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.v-progress-circular.wgu-maploading-status {
  position: fixed;
  bottom: 5em;
  right: 4em;
  z-index: 1;
}

</style>
