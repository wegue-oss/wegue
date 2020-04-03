<template>

  <v-card
    v-draggable-win="draggable" class="wgu-layerlist"
    v-if=show v-bind:style="{ left: left, top: top}"
  >
    <v-toolbar :color="color" class="" dark>
      <v-icon>{{icon}}</v-icon>
      <v-toolbar-title class="wgu-win-title">{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click="show=false"><v-icon>close </v-icon></v-app-bar-nav-icon>
    </v-toolbar>

    <wgu-layerlist />

  </v-card>

</template>

<script>
  import { DraggableWin } from '../../directives/DraggableWin.js';
  import LayerList from './LayerList';

  export default {
    name: 'wgu-layerlist-win',
    directives: {
      DraggableWin
    },
    components: {
      'wgu-layerlist': LayerList
    },
    props: {
      color: {type: String, required: false, default: 'red darken-3'},
      icon: {type: String, required: false, default: 'layers'},
      title: {type: String, required: false, default: 'Layers'},
      draggable: {type: Boolean, required: false, default: true},
      initPos: {type: Object, required: false}
    },
    data () {
      return {
        moduleName: 'wgu-layerlist',
        show: false,
        left: this.initPos ? this.initPos.left + 'px' : '10px',
        top: this.initPos ? this.initPos.top + 'px' : '70px'
      }
    }
  }
</script>

<style>

  .v-card.wgu-layerlist {
    position: absolute;
    z-index: 2;
  }

</style>
