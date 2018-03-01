// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import WguApp from './WguApp'

require('../node_modules/vuetify/dist/vuetify.min.css')
Vue.use(Vuetify)

require('../node_modules/ol/ol.css')

require('./assets/css/wegue.css')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<wgu-app/>',
  components: { WguApp }
})
