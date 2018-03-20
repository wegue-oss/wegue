// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import WguApp from './WguApp'

import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

require('../node_modules/ol/ol.css')

require('./assets/css/wegue.css')

Vue.config.productionTip = false

// Detect isEmbedded state by attribute embedded and
// make accessible for all components
// recommended by https://vuejs.org/v2/cookbook/adding-instance-properties.html
const appEl = document.querySelector('#app');
Vue.prototype.$isEmbedded = appEl.hasAttribute('embedded');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<wgu-app/>',
  components: { WguApp }
});
