<!-- This is a minimal module that helps getting started building custom modules -->

<!-- The template contains the HTML of our module  -->
<template>
  <!--
  Our module builds upon the 'wgu-module-card' and handles the integration into Wegue
  -->
  <wgu-module-card v-bind="$attrs"
      moduleName="sample-module"
      class="sample-module"
      :icon="icon">
    <!--
    Here goes the actual content of the module
    We use a the component 'v-card-text' from the Vuetify library
    in which we write a simple text
    -->
    <v-card-text>
      <!-- The text itself is located in the language specific translation files -->
      {{ $t('sample-module.text') }}
    </v-card-text>
  </wgu-module-card>
</template>

<!-- This part contains the logic of our module and is written in JavaScript -->
<script>
  // the module card is a the template for a typical Wegue module
  import ModuleCard from '../../src/components/modulecore/ModuleCard';

  /**
   * The part below is specific to the Vue.js framework
   * and is reduced to a minimum for the moment
   */
  export default {
    name: 'sample-module',
    inheritAttrs: false,
    components: {
      'wgu-module-card': ModuleCard
    },
    props: {
      icon: { type: String, required: false, default: 'star' }
    }
  }
</script>

<!-- Here we do the styling of our module -->
<style scoped>
  /* our module has the class '.sample-module' and we reference it here */
  .sample-module {
    left: auto !important;
    top:300px !important;
    right: 10px;
  }
</style>
