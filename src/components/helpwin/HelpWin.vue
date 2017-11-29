<template>
  <v-card class="wgu-helpwin" v-if=show>
    <v-toolbar class="teal white--text" dark>
      <v-toolbar-side-icon><v-icon>help</v-icon></v-toolbar-side-icon>
      <v-toolbar-title>Help</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Über OL / Vue.js WebGIS</h3>
        <div class="">
          Lorem Ipsum, Macco foo bar, etc.
        </div>
      </div>

    </v-card-title>
    <v-card-actions>
      <v-btn flat class="orange--text">More info...</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  // Import the EventBus
  import { WguEventBus } from '../../WguEventBus.js'

  export default {
    data () {
      return {
        show: false
      }
    },
    created: function () {
      var me = this
      // Listen to the 'toggle-helpwin' event of a connected toggle button
      WguEventBus.$on('toggle-helpwin', function (show) {
        me.show = show;
      });
    }
  }
</script>

<style>

  .wgu-helpwin {
    bottom: 10px;
    left: calc(50% - 150px);
    background-color: white;
    z-index: 2;
  }

  .wgu-helpwin.card {
      position: absolute;
  }

</style>
