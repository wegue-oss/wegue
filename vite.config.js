import { dirname, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

import Vuetify from 'vite-plugin-vuetify';

import eslintPlugin from '@nabla/vite-plugin-eslint';

import mdiWoff2OnlyPlugin from './plugins/vite-plugin-mdi-woff2';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Compile-time flags recommended to always be configured following Vite documentation.
    // See https://vuejs.org/api/compile-time-flags#compile-time-flags
    define: {
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    },
    plugins: [
      // Enable Vue compatibility build in Vue3 mode.
      // See https://v3-migration.vuejs.org/migration-build.html#compiler-specific-config
      vue({
        template: {
          compilerOptions: {
            compatConfig: {
              MODE: 3
            }
          }
        }
      }),
      // Remove Vue DevTools plugin when building for unit tests.
      ...(process.env.NODE_ENV === 'test' ? [] : [vueDevTools()]),
      Vuetify({
        styles: {
          configFile: 'app/styles/vuetify-settings.scss'
        }
      }),
      eslintPlugin({
        // Lint src and app directories.
        shouldLint: (path) => path.match(/\/(src|app)\/[^?]*\.(vue|svelte|m?[jt]sx?)$/)
      }),
      mdiWoff2OnlyPlugin()
    ],
    // Needed so vite-plugin-vuetify can process source code correctly.
    optimizeDeps: {
      exclude: [
        'vuetify'
      ]
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        APP: fileURLToPath(new URL('./app', import.meta.url)),
        // Ensure Vue compatibility build is used when importing Vue.
        vue: '@vue/compat'
      }
    },
    // Apply the default deployment path if not specified or if running unit tests.
    base: (process.env.NODE_ENV !== 'test' && env?.WGU_PUBLIC_PATH) || './',
    publicDir: 'app/public',
    server: {
      open: '/index.html'
    },
    preview: {
      open: '/index.html'
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          embedded: resolve(__dirname, 'embedded.html')
        }
      }
    }
  };
});
