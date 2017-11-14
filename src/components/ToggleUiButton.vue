<template>
  <!-- TODO check this approach for a toggle UI button: -->
  <!-- https://stackoverflow.com/questions/42419399/vue-js-2-how-to-access-data-in-method -->
  <!-- TODO think about deriving from this class for a MenuButton -->
  <div class="">

    <v-btn icon @click="toggleUi">
      <v-icon>{{icon}}</v-icon>
      {{text}}
    </v-btn>
    <div class="sub-ui"
      v-if="showUi"
    >
    Dummy Text for Sub-UI
    </div>

  </div>

</template>

<script>

import LayerList from './LayerList'

export default {
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
    LayerList
  },
  mounted () {
  },
  methods: {
    toggleUi () {
      // console.log('openUI of menubutton not overitten - this componnet will not work properly');

      // show / toggle child UI
      this.showUi = !this.showUi;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .sub-ui {
    left: 200px;
    top: 300px;
    border: 1px solid red;
  }

</style>
