import ObjectUtil from './Object.js'
import UrlUtil from './Url.js';

/**
 * Locale related utility methods.
 */
const LocaleUtil = {

  /**
   * Hardcoded fallback if no supported languages are declared in app config.
   */
  supportedLanguageFallback: { 'en': 'English' },

  /**
   * Import a webpack context for language files and returns message content.
   * @param {Object} context The webpack context returned by require.context.
   * @param {Object} mappingFunc A function to extract messages from an item of the webpack context.
   *
   * @returns {Object} A container with message data. Key is the language code, value contains the messages.
   */
  importLocales (context, mappingFunc) {
    return context
      .keys()
      .map((key) => ({ key, locale: key.match(/[a-z0-9-_]+/i)[0] }))
      .reduce(
        (messages, { key, locale }) => ({
          ...messages,
          [locale]: mappingFunc(context(key))
        }),
        {}
      );
  },

  /**
   * Import all Wegue core language files from 'src/locales' and optionally
   * app specific language files from 'app/locales'. Language files will be merged,
   * such that Wegue core messages can be overridden by app messages.
   *
   * @returns  {Object} A container with message data. Key is the language code, value contains the messages.
   */
  importVueI18nLocales () {
    const jsonContentExtractor = i => i;

    // Load Wegue core language files.
    let i18nMessages = LocaleUtil.importLocales(
      require.context('../locales', true, /[a-z0-9-_]+\.json$/i),
      jsonContentExtractor
    );

    // Try to load optional app specific language files and merge contents.
    try {
      let i18nMessagesApp = LocaleUtil.importLocales(
        require.context('../../app/locales', true, /[a-z0-9-_]+\.json$/i),
        jsonContentExtractor);
      ObjectUtil.mergeDeep(i18nMessages, i18nMessagesApp);
    } catch (e) {
    }

    return i18nMessages;
  },

  /**
   * Import vuetify language files from 'node_modules/vuetify/es/locale'.
   *
   * @returns A container with message data. Key is the language code, value contains the messages.
   */
  importVuetifyLocales () {
    const moduleDefaultExtractor = i => i.default;

    return LocaleUtil.importLocales(
      require.context('vuetify/es5/locale', false, /[a-z0-9-_]+\.js$/i),
      moduleDefaultExtractor
    );
  },

  /**
  * Detects the preferred language which is supported by the application
  * and returns the language code.
  * Priority order:
  * 1. URL-parameter
  * 2. Preferred browser language
  * 3. One of the accepted browser languages
  * 4. The fallback language declared in appConfig
  * 5. The fallback language declared above
  *
  * @param {Object} appConfig Global application context.
  * @returns The language code of the preferred language.
  */
  getPreferredLanguage (appConfig) {
    var precedence = [
      UrlUtil.getQueryParam('lang'),
      navigator.language || navigator.userLanguage,
      ...navigator.languages,
      LocaleUtil.getFallbackLanguage(appConfig),
      Object.keys(LocaleUtil.supportedLanguageFallback)[0]
    ];

    // Transform codes like 'de-DE' or 'en-GB' to 'de' or 'en'.
    var languages = precedence
      .filter(value => !!value)
      .map(value => {
        return value ? value.trim().split(/-|_/)[0] : null;
      });

    return languages.find(value => {
      return LocaleUtil.isLanguageSupported(value, appConfig);
    });
  },

  /**
   * Get languages supported by the application, which are declared in the application context.
   * Fallback will be {'en':'English}'
   *
   * @param {Object} appConfig Global application context.
   * @returns {Object} A container with key value pairs, while key corresponds to the language code and
   *  value contains a human readable language name.
   */
  getSupportedLanguages (appConfig) {
    const isDefined =
      appConfig.lang &&
      appConfig.lang.supported &&
      Object.keys(appConfig.lang.supported).length > 0;
    return isDefined ? appConfig.lang.supported : LocaleUtil.supportedLanguageFallback;
  },

  /**
   * Get the fallback language declared in the application context.
   * If none such it is declared, returns 'en'.
   *
   * @param {Object} appConfig Global application context.
   * @returns {String} The language code of the fallback language.
   */
  getFallbackLanguage (appConfig) {
    const isDefined =
      appConfig.lang &&
      appConfig.lang.fallback;
    return isDefined ? appConfig.lang.fallback : Object.keys(LocaleUtil.supportedLanguageFallback)[0]
  },

  /**
   * Checks whether the language code is supported by the application.
   *
   * @param {String} code The language code
   * @param {Object} appConfig Global application context.
   * @returns {Boolean} True if the language code is supported by the application.
   */
  isLanguageSupported (code, appConfig) {
    var supported = LocaleUtil.getSupportedLanguages(appConfig);
    return Object.keys(supported).includes(code);
  }
}

export default LocaleUtil;
