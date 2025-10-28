// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in vue.config.js with runtimeCompiler.
import { configureCompat, createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { md } from 'vuetify/iconsets/md';
import { aliases as defaultAliases, mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/styles';
import { createI18nInstance } from './locales/wgu-i18n';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import 'material-icons/iconfont/material-icons.css';
import 'ol/ol.css';
import WguApp from 'APP/WguApp';
import UrlUtil from './util/Url';
import IconUtil from './util/Icon';
import LocaleUtil from './util/Locale';
import ObjectUtil from './util/Object';
import ColorThemeUtil from './util/ColorTheme';
import axios from 'axios';

require('./assets/css/wegue.css');

configureCompat({
  MODE: 3
})

// try to load an optional app specific CSS file (set project-specific styles)
try {
  require('../app/static/css/app.css');
} catch (e) { }

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
const createVuetifyInstance = function (appConfig) {
  const customIcons = IconUtil.importIcons();
  const aliases = { ...defaultAliases, ...customIcons };
  const preset = {
    theme: ColorThemeUtil.buildTheme(appConfig.colorTheme),
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        md,
        mdi
      }
    },
    locale: {
      locale: LocaleUtil.getPreferredLanguage(appConfig),
      fallback: LocaleUtil.getFallbackLanguage(appConfig),
      messages: LocaleUtil.importVuetifyLocales()
    }
  };

  return createVuetify(preset);
}

/**
 * Creates the VueI18n object used for internationalization.
 *
 * @param {Object} appConfig Global application context.
 * @returns The active I18n instance.
 */
const createVueI18nInstance = function (appConfig) {
  return createI18nInstance(appConfig);
}

/**
 * Backwards compatibility layer for legacy features in app-conf.json.
 *
 * @param {Object} appConfig Global application context.
 * @returns The migrated application context.
 */
const migrateAppConfig = function (appConfig) {
  // Warning for deprecated baseColor
  if (appConfig.baseColor) {
    console.warn('The configuration path ".baseColor" is deprecated, ' +
      'instead declare a path ".colorTheme"');
  }

  // Migrate boolean values for module.win.
  if (appConfig.modules) {
    Object.keys(appConfig.modules).forEach(name => {
      const module = appConfig.modules[name];
      if (typeof module.win === 'boolean') {
        module.win = module.win ? 'floating' : undefined;
      }
    });
  }

  // Create warnings for text based configuration properties,
  // which are no longer supported and have been moved to the language files.
  /* eslint-disable no-useless-escape */
  /* eslint-disable quote-props */
  const deprecatedTextProps = {
    'title': 'app.title',
    'browserTitle': 'app.browserTitle',
    'footerTextLeft': 'app.footerTextLeft',
    'footerTextRight': 'app.footerTextRight',
    'mapGeodataDragDrop\\.layerName': 'mapLayers.wgu-drag-drop-layer.name',
    'modules.\\.wgu-attributetable\\.selectorLabel': 'wgu-attributetable.selectorLabel',
    'modules\\.wgu-geocoder\\.placeHolder': 'wgu-geocoder.placeHolder',
    'modules\\.wgu-infoclick\\.mediaInfoLinkText': 'wgu-infoclick.mediaInfoLinkText',
    'modules\\.wgu-zoomtomaxextent\\.text': 'wgu-zoomtomaxextent.text',
    'modules\\.wgu-helpwin\\.windowTitle': 'wgu-helpwin.title',
    'modules\\.wgu-helpwin\\.textTitle': 'wgu-helpwin.textTitle',
    'modules\\.wgu-helpwin\\.htmlContent': 'wgu-helpwin.htmlContent',
    'modules\\.wgu-helpwin\\.infoLinkUrl': 'wgu-helpwin.infoLinkUrl',
    'modules\\.wgu-helpwin\\.infoLinkText': 'wgu-helpwin.infoLinkText',
    'modules\\..*\\.title': '<moduleName>.title'
  };
  /* eslint-enable quote-props */
  /* eslint-enable no-useless-escape */

  const configPaths = ObjectUtil.toPaths(appConfig);
  for (const path of configPaths) {
    const match = Object.keys(deprecatedTextProps).find(pattern => {
      const regex = new RegExp('^\\.' + pattern + '$', 'g');
      return regex.test(path);
    });
    if (match) {
      console.warn('The configuration path "' + path + '" is deprecated, ' +
        'instead declare a path "' + deprecatedTextProps[match] +
        '" in all language files in your "/app/locales" folder');
    }
  };

  // Create warnings and migrate settings related to mapLayers configuration:
  if (appConfig.mapLayers) {
    appConfig.mapLayers.forEach((layer, i) => {
      if (!layer.lid) {
        console.warn('mapLayers[' + i + '] does not declare a lid property');
      }
      if (layer.type === 'WMS') {
        console.warn('mapLayers[' + i + '] uses the deprecated type WMS. Use TILEWMS instead.');
        layer.type = 'TILEWMS';
      }
    });
  }

  // Create warnings related to Vuetify color theme configuration,
  // which name have changed in Vuetify 3.x:
  /* eslint-disable no-useless-escape */
  const deprecatedColorThemeProps = {
    'colorTheme\\.themes\\.light\\.onprimary': '.colorTheme.themes.light.on-primary',
    'colorTheme\\.themes\\.light\\.onsecondary': '.colorTheme.themes.light.on-secondary',
    'colorTheme\\.themes\\.dark\\.onprimary': '.colorTheme.themes.dark.on-primary',
    'colorTheme\\.themes\\.dark\\.onsecondary': '.colorTheme.themes.dark.on-secondary'
  };
  /* eslint-enable no-useless-escape */

  for (const path of configPaths) {
    const match = Object.keys(deprecatedColorThemeProps).find(pattern => {
      const regex = new RegExp('^\\.' + pattern + '$', 'g');
      return regex.test(path);
    });
    if (match) {
      console.warn('The configuration path "' + path + '" is deprecated, ' +
        'instead declare a path "' + deprecatedColorThemeProps[match] + '"');
    }
  };

  // Create warnings, if one of the color specific animation properties is declared,
  // which are no longer supported due to global view animation configuration.
  /* eslint-disable no-useless-escape */
  const deprecatedAnimProps = {
    'modules\\.wgu-geolocator\\.zoomAnimation': 'viewAnimation.type',
    'modules\\.wgu-geolocator\\.zoomAnimationDuration': 'viewAnimation.options.duration',
    'modules\\.wgu-geolocator\\.maxZoom': 'viewAnimation.options.maxZoom',
    'modules\\.wgu-geocoder\\.selectZoom': 'viewAnimation.options.zoom'
  };
  /* eslint-enable no-useless-escape */

  for (const path of configPaths) {
    const match = Object.keys(deprecatedAnimProps).find(pattern => {
      const regex = new RegExp('^\\.' + pattern + '$', 'g');
      return regex.test(path);
    });
    if (match) {
      console.warn('The configuration path "' + path + '" is deprecated, ' +
        'instead declare the "viewAnimation" option and configure the "' + deprecatedAnimProps[match] +
        '" property');
    }
  };

  return appConfig;
}

/**
 * Create the vue application.
 *
 * @param {Object} appConfig Global application context.
 */
const createAppInstance = function (appConfig) {
  const effectiveAppConfig = migrateAppConfig(appConfig);
  const vuetify = createVuetifyInstance(effectiveAppConfig);
  const i18n = createVueI18nInstance(effectiveAppConfig);

  const app = createApp(WguApp);
  app.use(vuetify);
  app.use(i18n);

  // it is recommended to use the provide/inject functionality instead of defining
  // global proeprties in Vue3.
  // see https://v3-migration.vuejs.org/breaking-changes/global-api#provide-inject

  // make app config accessible for all components
  app.config.globalProperties.$appConfig = effectiveAppConfig;

  // Detect isEmbedded state by attribute embedded and
  // make accessible for all components
  const appEl = document.querySelector('#app');
  app.config.globalProperties.$isEmbedded = appEl.hasAttribute('embedded');

  app.mount('#app');
};

// Look in the static dir for an app-specific config file.
const configFile = 'static/app-conf' + appCtxFile + '.json';
const request = {
  method: 'GET',
  url: configFile
};
axios(request)
  .then(response => {
    createAppInstance(response.data);
  }).catch(function (error) {
    console.error(`Cannot load config file ${configFile}, ${error}`);
  });
