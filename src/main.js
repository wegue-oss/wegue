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
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
Vue.use(PortalVue);
Vue.use(VueI18n);

// necessary for some components
export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg'
  }
})

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
 * Backwards compatibility layer for legacy features in app-conf.json.
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

const isObject = function (item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep in place merge of source object into target object.
 */
const mergeDeep = function (target, source) {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
}

/**
 * Import webpack context for locale files into target.
 */
const importLocales = function (target, context) {
  const messages = context
    .keys()
    .map((key) => ({ key, locale: key.match(/[a-z0-9-_]+/i)[0] }))
    .reduce(
      (messages, { key, locale }) => ({
        ...messages,
        [locale]: context(key)
      }),
      {}
    );
  mergeDeep(target, messages);
}

const createVueI18nContext = function () {
  let i18nMessages = {};

  importLocales(i18nMessages, require.context('./locales', true, /[a-z0-9-_]+\.json$/i));

  // Try to load an optional app specific language file.
  try {
    importLocales(i18nMessages, require.context('../app/locales', true, /[a-z0-9-_]+\.json$/i));
  } catch (e) {
  }

  // TODO get locale information from config / browser detection
  const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: i18nMessages
  });

  return i18n;
}

const opts = {};
const createApp = function (appConfig) {
  // make app config accessible for all components
  Vue.prototype.$appConfig = migrateAppConfig(appConfig);
  const i18nContext = createVueI18nContext(appConfig);
  /* eslint-disable no-new */
  new Vue({
    vuetify: new Vuetify(opts),
    i18n: i18nContext,
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
