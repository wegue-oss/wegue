<template>
  <v-btn-toggle borderless dense 
    background-color="transparent" :dark="dark" 
    v-model="show">
    <v-btn icon :value="true" @click="toggleUi">
      <v-icon medium>{{icon}}</v-icon>
      {{text}}
    </v-btn>
  </v-btn-toggle>
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
    dark: {type: Boolean, required: false, default: false},
    visible: {type: Boolean, required: false, default: false}
  },
  data: function () {
    return {
      show: this.visible
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
