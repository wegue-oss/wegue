<template>

  <v-btn icon @click="toggleUi">
    <v-icon medium>{{icon}}</v-icon>
    {{text}}
  </v-btn>

</template>


<script>

import Vue from 'vue';
import MeasureWin from './MeasureWin'
import { WguEventBus } from '../../WguEventBus'

export default {
  name: 'wgu-measuretool-btn',
  components: {
    'wgu-measuretool-win': MeasureWin
  },
  data: function () {
    return {
      moduleName: 'wgu-measuretool',
      // TODO move to props with default
      icon: 'photo_size_select_small',
      text: ''
    }
  },
  created () {
    var me = this;
    // TODO move to a father class
    WguEventBus.$on('app-mounted', () => {
      me.win = Vue.prototype.cmpLookup[me.moduleName + '-win'];
    });
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
