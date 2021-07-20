import VueI18n from 'vue-i18n';

/**
 * Locale related utility methods.
 */
const LocaleUtil = {

  /**
   * Tests whether item is an object
   * @param {*} item The item to test.
   * @returns True if the item is an object.
   */
  isObject (item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  },

  /**
   * Deep in place merge of source object into target object.
   * @param {object} target The target of the merge operation.
   * @param {object} source The source of the merge operation.
   */
  mergeDeep (target, source) {
    if (LocaleUtil.isObject(target) && LocaleUtil.isObject(source)) {
      for (const key in source) {
        if (LocaleUtil.isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          }
          LocaleUtil.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  },

  /**
   * Import a webpack context for language files and returns message content.
   * @param {object} context The webpack context returned by require.context.
   * @param {object} mappingFunc A function to extract messages from an item of the webpack context.
   *
   * @returns {object} A container with message data. Key is the language code, value contains the messages.
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
   * Creates the VueI18n object used for internationalization.
   * This imports all Wegue core language files from 'src/locales' and optionally
   * app specific language files from 'app/locales'. Language files will be merged,
   * such that Wegue core messages can be overridden by app messages.
   *
   * @returns
   */
  createVueI18nContext () {
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
      LocaleUtil.mergeDeep(i18nMessages, i18nMessagesApp);
    } catch (e) {
    }

    // TODO get locale information from config / browser detection
    const i18n = new VueI18n({
      locale: 'en',
      fallbackLocale: 'en',
      messages: i18nMessages
    });

    return i18n;
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
  }
}

export default LocaleUtil;
