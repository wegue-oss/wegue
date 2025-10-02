import { dirname, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

import Vuetify from 'vite-plugin-vuetify';
import Unfonts from 'unplugin-fonts/vite';

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
      ...(process.env.NODE_ENV === 'test' ? [] : [vueDevTools()]),
      Vuetify(),
      Unfonts({
        fontsource: {
          families: [
            {
              name: 'Roboto',
              weights: [100, 300, 400, 500, 700, 900],
              styles: ['normal', 'italic']
            }
          ]
        }
      })
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
    base: (process.env.NODE_ENV !== 'test' && env?.WGU_PUBLIC_PATH) || '/',
    publicDir: 'app/static',
    server: {
      open: '/index.html'
    },
    preview: {
      open: '/index.html'
    },
    css: {
      preprocessorOptions: {
        sass: {
          api: 'modern-compiler'
        },
        scss: {
          api: 'modern-compiler'
        }
      }
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
