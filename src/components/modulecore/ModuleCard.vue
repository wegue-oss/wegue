<template>
  <v-card class="wgu-module-card wgu-floating" 
    v-if=show 
    v-draggable-win="draggable"  
    v-bind:style="{ left: left, top: top }"> 

    <v-toolbar :color="color" dark>
      <v-icon class="mr-4">{{ icon }}</v-icon>
      <v-toolbar-title class="wgu-win-title">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click="toggleUi">
        <v-icon>close</v-icon>
      </v-app-bar-nav-icon>
    </v-toolbar>

    <!-- Default slot for module content -->
    <slot></slot>
  </v-card>
</template>

<script>
  import { DraggableWin } from '@Wegue/directives/DraggableWin';
  import { WguEventBus } from '../../WguEventBus'
  export default {
    name: 'wgu-module-card',
    directives: {
      DraggableWin
    },
    props: {
      moduleName: {type: String, required: true},
      icon: {type: String, required: true},
      title: {type: String, required: true},
      color: {type: String, required: false, default: 'red darken-3'},
      draggable: {type: Boolean, required: false, default: true},
      initPos: {type: Object, required: false}
    },
    data () {
      return {
        show: false,
        left: this.initPos ? this.initPos.left + 'px' : '0px',
        top: this.initPos ? this.initPos.top + 'px' : '0px'
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
}
</script>