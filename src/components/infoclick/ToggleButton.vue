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
  name: 'wgu-infoclick-btn',
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
      // TODO move to a father class
      this.$refs.infoClickWin.show = !this.$refs.infoClickWin.show;
      this.show = this.$refs.infoClickWin.show;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
