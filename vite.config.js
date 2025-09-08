import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import Vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 3,
          },
        },
      },
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
      'APP': fileURLToPath(new URL('./app', import.meta.url)),
      vue: '@vue/compat'
    },
  },
  publicDir: 'app/static'
})
