<template>
  <v-overlay
    :model-value="show"
    :opacity="0.25"
    class="align-center justify-center"
  >
    <v-progress-circular
      indeterminate
      color="primary"
    >
    </v-progress-circular>
  </v-overlay>
</template>

<script>
import { WguEventBus } from '@/WguEventBus';

export default {
  name: 'wgu-app-loading-mask',
  components: {},
  data () {
    return {
      show: false
    }
  },
  created () {
    WguEventBus.$on('app-loading-mask-toggle', (visible) => {
      // toggle or force a visibility of the loading mask
      if (typeof visible === 'boolean') {
        this.show = visible;
      } else {
        this.show = !this.show;
      }
    });
  }
};
</script>
