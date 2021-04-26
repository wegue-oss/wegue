<template>

  <v-btn icon :dark="dark" @click="toggleUi">
    <v-icon medium>{{icon}}</v-icon>
    {{text}}
  </v-btn>

</template>

<script>
import { WguEventBus } from '../../WguEventBus'

export default {
  name: 'wgu-attributetable-btn',
  props: {
    // alternative icons: table_chart, view_comfy
    icon: {type: String, required: false, default: 'table_chart'},
    text: {type: String, required: false, default: ''},
    dark: {type: Boolean, required: false, default: false}
  },
  data: function () {
    return {
      moduleName: 'wgu-attributetable',
      show: false
    }
  },
  created () {
    // TODO move to a father class
    WguEventBus.$on(this.moduleName + 'visibility-change', visible => {
      this.show = visible;
    });
  },
  methods: {
    toggleUi () {
      // TODO move to a father class
      WguEventBus.$emit(this.moduleName + 'visibility-change', !this.show)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
