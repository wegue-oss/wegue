<template>

  <v-btn icon :dark="dark" @click="toggleUi">
    <v-icon medium>{{icon}}</v-icon>
    {{text}}
  </v-btn>

</template>

<script>
import Vue from 'vue'
import { WguEventBus } from '../../WguEventBus'

export default {
  name: 'wgu-infoclick-btn',
  props: {
    icon: {type: String, required: false, default: 'info'},
    text: {type: String, required: false, default: ''},
    dark: {type: Boolean, required: false, default: false}
  },
  data: function () {
    return {
      moduleName: 'wgu-infoclick'
    }
  },
  created () {
    var me = this;
    // TODO move to a father class
    WguEventBus.$on('app-mounted', () => {
      me.win = Vue.prototype.cmpLookup[me.moduleName + '-win'];
    });
    if (!me.win) {
      me.win = Vue.prototype.cmpLookup[me.moduleName + '-win'];
    }
  },
  methods: {
    toggleUi () {
      // TODO move to a father class
      this.win.show = !this.win.show;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
