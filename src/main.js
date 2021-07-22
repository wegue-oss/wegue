// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import PortalVue from 'portal-vue'
import VueI18n from 'vue-i18n';
import '@mdi/font/css/materialdesignicons.css'
import 'material-icons/iconfont/material-icons.css'
import '../node_modules/ol/ol.css';
import WguApp from '../app/WguApp';
import UrlUtil from './util/Url';
import LocaleUtil from './util/Locale';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
Vue.use(PortalVue);
Vue.use(VueI18n);

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

/**
 * Creates the active vuetify instance.
 *
 * @param {Object} appConfig Global application context.
 * @returns The active vuetify instance.
 */
const createVuetify = function (appConfig) {
  const preset = {
    icons: {
      iconfont: 'mdiSvg'
    },
    lang: {
      current: LocaleUtil.getPreferredLanguage(appConfig),
      locales: LocaleUtil.importVuetifyLocales()
    }
  };
  return new Vuetify(preset);
}

/**
 * Creates the VueI18n object used for internationalization.
 *
 * @param {Object} appConfig Global application context.
 * @returns The active I18n instance.
 */
const createVueI18n = function (appConfig) {
  const preset = {
    locale: LocaleUtil.getPreferredLanguage(appConfig),
    fallbackLocale: LocaleUtil.getFallbackLanguage(appConfig),
    messages: LocaleUtil.importVueI18nLocales()
  };
  return new VueI18n(preset);
}

/**
 * Backwards compatibility layer for legacy features in app-conf.json.
 *
 * @param {Object} appConfig Global application context.
 * @returns The migrated application context.
 */
const migrateAppConfig = function (appConfig) {
  // Migrate boolean values for module.win.
  if (appConfig.modules) {
    Object.keys(appConfig.modules).forEach(name => {
      var module = appConfig.modules[name];
      if (typeof module.win === 'boolean') {
        module.win = module.win ? 'floating' : undefined;
      }
    });
  }
  // Migrate windowTitle value for help win
  if (appConfig.modules && appConfig.modules['wgu-helpwin']) {
    var module = appConfig.modules['wgu-helpwin'];
    if (!module.title && module.windowTitle) {
      module.title = module.windowTitle;
    }
  }
  return appConfig;
}

/**
 * Create the vue application.
 *
 * @param {Object} appConfig Global application context.
 */
const createApp = function (appConfig) {
  // make app config accessible for all components
  Vue.prototype.$appConfig = migrateAppConfig(appConfig);

  /* eslint-disable no-new */
  new Vue({
    vuetify: createVuetify(appConfig),
    i18n: createVueI18n(appConfig),
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
