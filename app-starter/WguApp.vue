<!-- Created by init-app.js at Tue Mar 10 2020 16:02:41 GMT+0100 (GMT+01:00) -->
<template>
  <wgu-app-tpl>
    <!-- insert your app slots here  -->
  </wgu-app-tpl>
</template>

<script>
  import WguAppTemplate from './WguAppTemplate.vue';
  export default {
    name: 'my-wgu-app',
    components: {
      'wgu-app-tpl': WguAppTemplate
    }
    // add Vue methods and hooks here
  }
</script>
