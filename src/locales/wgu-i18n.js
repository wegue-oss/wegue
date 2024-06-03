/**
 * Creates the VueI18n object used for internationalization.
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import LocaleUtil from '@/util/Locale';

Vue.use(VueI18n);

const appConfig = Vue.prototype.$appConfig;

const preset = {
  locale: LocaleUtil.getPreferredLanguage(appConfig),
  fallbackLocale: LocaleUtil.getFallbackLanguage(appConfig),
  messages: LocaleUtil.importVueI18nLocales()
};

export const i18n = new VueI18n(preset);
