<template>

  <div class="">

    <v-btn icon @click="toggleUi">
      <v-icon medium>{{icon}}</v-icon>
      {{text}}
    </v-btn>

    <wgu-infoclick-win
      ref="infoClickWin"
      :icon="icon"
      :left="left"
      :top="top"
    />

  </div>

</template>

<script>

import InfoClickWin from './InfoClickWin.vue'

export default {
  name: 'wgu-toggle-infoclick-button',
  components: {
    'wgu-infoclick-win': InfoClickWin
  },
  data: function () {
    return {
      show: false,
      icon: 'info',
      text: '',
      left: '30px',
      top: '30px'
    }
  },
  methods: {
    toggleUi () {
      // TODO check how to call the super method
      this.show = !this.show;
      // forward property 'show' to window child componnet
      this.$refs.infoClickWin.show = this.show;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
