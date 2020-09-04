
<template>

 <v-dialog v-model="show" max-width="300" :hide-overlay="false">
   <template v-slot:activator="{ on }">
    <v-btn icon dark="dark" v-on="on" > 
      <v-icon medium>{{icon}}</v-icon></v-btn>
      {{text}}
    </template>

    <wgu-helpwin
      ref="helpwin"
      :color="color"
      :icon="icon"
      :title="text"
      :headline="headline"
      :content="content"
      :infoLink="infoLink"
      :infoLinkText="infoLinkText"
      v-on:winxclose="show=false"
    />

  </v-dialog>

</template>

<script>

import HelpWin from './HelpWin'

export default {
  name: 'wgu-helpwin-btn',
  components: {
    'wgu-helpwin': HelpWin
  },
  props: {
    color: {type: String, required: false, default: 'red darken-3'},
    icon: {type: String, required: false, default: 'help'},
    text: {type: String, required: false},
    dark: {type: Boolean, required: false, default: false},
    headline: {type: String, required: false},
    content: {type: String, required: false},
    infoLink: {type: String, required: false},
    infoLinkText: {type: String, required: false}
  },
  data: function () {
    return {
      show: false
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
