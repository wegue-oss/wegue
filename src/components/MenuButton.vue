<template>

  <v-btn icon @click="onClick">
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
    onClick () {
      console.warn('"onClick" of v-webgis-menubutton not overitten');
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
