<template>

  <v-btn icon @click="openUi">
    <v-icon>{{icon}}</v-icon>
    {{text}}
  </v-btn>

</template>

<script>

export default {
  name: 'v-webgis-menubutton',
  props: {
    icon: {type: String, required: false},
    text: {type: String, required: false}
  },
  mounted () {
  },
  methods: {
    openUi () {
      // console.log('openUI of menubutton not overitten - this componnet will not work properly');

      // TODO show / toggle child UI
      console.log(this.$children[0]);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


</style>
