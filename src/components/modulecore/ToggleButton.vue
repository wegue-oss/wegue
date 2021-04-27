<template>
  <v-btn icon :dark="dark" @click="toggleUi">
    <v-icon medium>{{icon}}</v-icon>
    {{text}}
  </v-btn>
</template>

<script>
import { WguEventBus } from '../../WguEventBus'

export default {
  name: 'wgu-toggle-btn',
  props: {
    moduleName: {type: String, required: true},
    icon: {type: String, required: true},
    // TODO remove this option as it is not in use?
    text: {type: String, required: false, default: ''},
    dark: {type: Boolean, required: false, default: false}
  },
  data: function () {
    return {
      show: false
    }
  },
  created () {
    WguEventBus.$on(this.moduleName + 'visibility-change', visible => {
      this.show = visible;
    });
  },
  methods: {
    toggleUi () {
      WguEventBus.$emit(this.moduleName + 'visibility-change', !this.show)
    }
  }
};
</script>
