<template>

  <div class="">

    <v-btn icon @click="onClick">
      <v-icon>{{icon}}</v-icon>
      {{text}}
    </v-btn>

  </div>

</template>

<script>

export default {
  name: 'wgu-menubutton',
  props: {
    icon: {type: String, required: false},
    text: {type: String, required: false}
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
