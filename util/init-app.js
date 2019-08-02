const fs = require('fs');
const now = new Date();

const header = '<!-- Created by init-app.js at ' + now + ' -->';
const appMarkup = header + `
<template>
  <wgu-app-tpl>
    <!-- insert your app slots here  -->
  </wgu-app-tpl>
</template>

<script>
  import WguAppTemplate from '../src/WguAppTemplate.vue';
  export default {
    name: 'my-wgu-app',
    components: {
      'wgu-app-tpl': WguAppTemplate
    }
    // add Vue methods and hooks here
  }
</script> `;

const cssHeader = '/* Created by init-app.js at ' + now + ' */';

fs.writeFile('app/WguApp.vue', appMarkup, function (err) {
  if (err) {
    console.log('Error while initializing application (WguApp.vue)', err);
  } else {
    fs.mkdir('app/css', { recursive: true }, (err) => {
      if (err) throw err;
      fs.writeFile('app/css/app.css', cssHeader, function (err) {
        if (err) {
          console.log('Error while initializing application (app.css)', err);
        } else {
          console.log('Successfully initialized Wegue app.');
        }
      });
    });
  }
});
