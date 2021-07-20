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
   * Import a webpack context for locale files into target.
   * @param {object} target The target container of the locale message data.
   * @param {object} context The webpack context returned by require.context.
   */
  importLocales (target, context) {
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
    LocaleUtil.mergeDeep(target, messages);
  },

  /**
   * Creates the VueI18n object used for internationalization.
   * This imports all Wegue core language files from 'src/locales' and optionally
   * app specific language files from 'app/locales'.
   */
  createVueI18nContext () {
    let i18nMessages = {};

    LocaleUtil.importLocales(i18nMessages, require.context('../locales', true, /[a-z0-9-_]+\.json$/i));

    // Try to load an optional app specific language file.
    try {
      LocaleUtil.importLocales(i18nMessages, require.context('../../app/locales', true, /[a-z0-9-_]+\.json$/i));
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
}

export default LocaleUtil;
