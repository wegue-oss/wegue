import { dirname, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

import Vuetify from 'vite-plugin-vuetify';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            compatConfig: {
              MODE: 3
            }
          }
        }
      }),
      vueDevTools(),
      Vuetify()
    ],
    optimizeDeps: {
      exclude: [
        'vuetify'
      ]
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        APP: fileURLToPath(new URL('./app', import.meta.url)),
        vue: '@vue/compat'
      }
    },
    base: env.WGU_PUBLIC_PATH ?? '/',
    publicDir: 'app/static',
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
