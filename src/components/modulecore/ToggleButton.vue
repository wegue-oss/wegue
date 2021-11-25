<template>
  <v-btn-toggle
    class="wgu-toggle-button"
    borderless
    dense 
    :color="color"
    background-color="transparent" 
    :title="$t(moduleName + '.title')"
    v-model="show">
    <v-btn icon :value="true" @click="toggleUi">
      <v-icon :color="color" medium>{{icon}}</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
import { WguEventBus } from '../../WguEventBus'

export default {
  name: 'wgu-toggle-btn',
  props: {
    color: { type: String, default: null },
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
      WguEventBus.$emit(this.moduleName + '-visibility-change', !this.show)
    }
  }
};
</script>
<style>
/**
  Required to fix the hover button color.
  Also fixes the color of any possible text
  inside the button.
 */
.wgu-toggle-button .v-btn {
  color: inherit !important;
}
</style>
