// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import WguApp from '../app/WguApp';
import UrlUtil from './util/Url';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

require('../node_modules/ol/ol.css');

require('./assets/css/wegue.css');

// try to load an optional app specific CSS file (set project-specific styles)
try {
  require('../app/static/css/app.css');
} catch (e) {}

Vue.config.productionTip = false;

// Detect isEmbedded state by attribute embedded and
// make accessible for all components
// recommended by https://vuejs.org/v2/cookbook/adding-instance-properties.html
const appEl = document.querySelector('#app');
Vue.prototype.$isEmbedded = appEl.hasAttribute('embedded');

// Detect an URL parameter for a custom app context
const appCtx = UrlUtil.getQueryParam('appCtx');
let appCtxFile = '';
if (appCtx) {
  // simple aproach to avoid path traversal
  appCtxFile = '-' + appCtx.replace(/(\.\.[/])+/g, '');
}
const opts = {};
const createApp = function (appConfig) {
  // make app config accessible for all components
  Vue.prototype.$appConfig = appConfig;
  /* eslint-disable no-new */
  new Vue({
    vuetify: new Vuetify(opts),
    el: '#app',
    template: '<wgu-app/>',
    components: { WguApp }
  });
};

// Look in the static dir for an app-specific config file.
const configFile = 'static/app-conf' + appCtxFile + '.json';
fetch(configFile)
  .then(function (response) {
    return response.json().then(function (appConfig) {
      createApp(appConfig);
    })
  }).catch(function () {
    console.error('Cannot load config file: ' + configFile)
  });
