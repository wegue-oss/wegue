<template>
  <!-- TODO check this approach for a toggle UI button: -->
  <!-- https://stackoverflow.com/questions/42419399/vue-js-2-how-to-access-data-in-method -->
  <!-- TODO think about deriving from this class for a MenuButton -->
  <div class="">

    <v-btn icon @click="toggleUi">
      <v-icon>{{icon}}</v-icon>
      {{text}}
    </v-btn>

  </div>

</template>

<script>

import { EventBus } from '../../EventBus.js'

export default {
  name: 'v-webgis-toggle-layerlist-button',
  props: {
    icon: {type: String, required: false},
    text: {type: String, required: false},
    subCmpId: {type: String, required: false}
  },
  data () {
    return {
      showUi: false
      // subCmpId: 'kalle'
    }
  },
  mounted () {
  },
  methods: {
    toggleUi () {
      // show / toggle child UI
      this.showUi = !this.showUi;

      console.log('subCmp emit -->', this.showUi);

      EventBus.$emit('toggle-layerlist', this.showUi);
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
