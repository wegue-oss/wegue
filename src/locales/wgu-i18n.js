/**
 * Creates the VueI18n object used for internationalization.
 */
import { createI18n } from 'vue-i18n';
import LocaleUtil from '@/util/Locale';

let i18nInstance

export function createI18nInstance (appConfig) {
  const preset = {
    locale: LocaleUtil.getPreferredLanguage(appConfig),
    fallbackLocale: LocaleUtil.getFallbackLanguage(appConfig),
    messages: LocaleUtil.importVueI18nLocales()
  };
  i18nInstance = createI18n(preset);
  return i18nInstance;
};

export function i18n () {
  return i18nInstance.global;
}
