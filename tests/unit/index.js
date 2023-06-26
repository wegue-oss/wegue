import Vue from 'vue'
import Vuetify from 'vuetify'
import PortalVue from 'portal-vue'
import VueI18n from 'vue-i18n'
import i18nMessages from '../../src/locales/en.json';

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(PortalVue)
Vue.use(VueI18n)

// Setup VueI18n, only english language files from 'src/locales/en.json'
// are used for testing. Translation warnings are silenced, since some of the
// resources used for testing are dummy and have no corresponding entry in the
// language pack.
Vue.prototype._i18n = new VueI18n({
  locale: 'en',
  messages: { en: i18nMessages },
  silentTranslationWarn: true
})

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/)
srcContext.keys().forEach(srcContext)
