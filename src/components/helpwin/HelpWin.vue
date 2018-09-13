<template>

  <v-card class="wgu-helpwin">
    <v-toolbar class="red darken-3 white--text" dark>
      <v-toolbar-side-icon><v-icon>{{icon}}</v-icon></v-toolbar-side-icon>
      <v-toolbar-title>About</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click="onWinXClose"><v-icon>close</v-icon></v-toolbar-side-icon>
    </v-toolbar>

    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ headline }}</h3>
        <div class="">
          <span v-html="content"></span>
        </div>
      </div>
    </v-card-title>

    <v-card-actions>
      <a class="info-link red--text darken3"
        :href="infoLink" target="_blank">{{ infoLinkText }}</a>
    </v-card-actions>
  </v-card>

</template>

<script>
  export default {
    props: ['icon', 'headline', 'content', 'infoLink', 'infoLinkText'],
    data () {
      return {
        show: false
      }
    },
    methods: {
      onWinXClose: function () {
        this.$emit('winxclose');
      }
    }
  }
</script>

<style>

</style>
