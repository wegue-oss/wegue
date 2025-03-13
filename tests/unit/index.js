import { configureCompat } from 'vue'
import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import { createI18n } from 'vue-i18n'
// import i18nMessages from '@/locales/en.json'

// Temporarily using the Vue migration build. Sets it to V3 mode to remove
// a lot of deprecation warnings.
configureCompat({
  MODE: 3
})

// Setup VueI18n, only english language files from 'src/locales/en.json'
// are used for testing. Translation warnings are silenced, since some of the
// resources used for testing are dummy and have no corresponding entry in the
// language pack.
// const i18nInstance = createI18n({
//   legacy: false,
//   globalInjection: true,
//   stopEffectScope: false,
//   locale: 'en',
//   fallbackLocale: 'en',
//   messages: { en: i18nMessages },
//   missingWarn: false,
//   fallbackWarn: false,
//   warnHtmlMessage: false
// })

// Setup Vuetify
const vuetifyInstance = createVuetify({ components, directives })

// Setup global plugins to be added to all mounted components by VTU
// config.global.plugins = [i18nInstance, vuetifyInstance]
config.global.plugins = [vuetifyInstance]

config.global.mocks = {
  $t: tKey => tKey,
  $te: _ => true
}

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/)
srcContext.keys().forEach(srcContext)
