<template>
  <!-- Inspired by: -->
  <!-- https://stackoverflow.com/questions/42419399/vue-js-2-how-to-access-data-in-method -->
  <div class="">

    <v-btn icon @click="toggleUi">
      <v-icon>{{icon}}</v-icon>
      {{text}}
    </v-btn>

  </div>

</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'v-webgis-menubutton',
  props: {
    icon: {type: String, required: false},
    text: {type: String, required: false}
  },
  data () {
    return {
      showUi: false
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    toggleUi () {
      // show / toggle child UI
      this.showUi = !this.showUi;
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
