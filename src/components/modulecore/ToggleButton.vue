<template>
  <v-btn-toggle
    variant="text"
    class="wgu-toggle-button bg-primary"
    :title="$t(moduleName + '.title')"
    v-model="show">
    <v-btn :icon="icon" :value="true" @click="toggleUi">
    </v-btn>
  </v-btn-toggle>
</template>

<script>
import { WguEventBus } from '../../WguEventBus'

export default {
  name: 'wgu-toggle-btn',
  props: {
    moduleName: { type: String, required: true },
    icon: { type: String, required: true },
    visible: { type: Boolean, required: false, default: false }
  },
  data: function () {
    return {
      show: this.visible
    }
  },
  created () {
    WguEventBus.$on(this.moduleName + '-visibility-change', visible => {
      this.show = visible;
    });
  },
  methods: {
    toggleUi () {
      WguEventBus.$emit(this.moduleName + '-visibility-change', !!this.show);
    }
  }
};
</script>
