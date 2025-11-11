import { configureCompat } from 'vue';
import { config } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Temporarily using the Vue migration build. Sets it to V3 mode to remove
// a lot of deprecation warnings.
configureCompat({
  MODE: 3
});

// Setup Vuetify
const vuetifyInstance = createVuetify({ components, directives });

// Setup global plugins to be added to all mounted components by VTU
config.global.plugins = [vuetifyInstance];

config.global.mocks = {
  $t: tKey => tKey,
  $te: _ => true
};

// Import all test files (files that ends with .spec.js under ./specs directory)
import.meta.glob('./specs/**/*.spec.js', { eager: true });

// Import all source files except main.js for coverage.
// You can also change this to match only the subset of files that
// you want coverage for.
import.meta.glob('../../src/**/!(*main).js', { eager: true });
