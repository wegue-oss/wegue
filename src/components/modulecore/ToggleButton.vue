<template>
  <v-btn-toggle
    borderless
    dense 
    color="onprimary"
    background-color="transparent" 
    :title="$t(moduleName + '.title')"
    v-model="show">
    <v-btn icon :value="true" color="onprimary" @click="toggleUi">
      <v-icon color="onprimary" medium>{{icon}}</v-icon>
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
      WguEventBus.$emit(this.moduleName + '-visibility-change', !this.show)
    }
  }
};
</script>
