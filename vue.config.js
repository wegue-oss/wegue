const path = require('path');
const { defineConfig } = require('@vue/cli-service');

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = defineConfig({
  assetsDir: 'static',
  publicPath: process.env.WGU_PUBLIC_PATH || './',
  runtimeCompiler: true,
  pages: {
    app: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Wegue WebGIS',
      favicon: 'app/static/icon/favicon.ico'
    },
    embedded: {
      entry: 'src/main.js',
      template: 'public/embedded.html',
      filename: 'embedded.html',
      title: 'Wegue WebGIS Embedded',
      favicon: 'app/static/icon/favicon.ico'
    }
  },

  devServer: {
    client: {
      logging: 'warn',
      overlay: {
        // Added to remove ResizeObserver errors thrown when Vuetify lists become too large. Vuetify bug ?
        // See https://stackoverflow.com/questions/77564331/vuetify-crashes-with-resizeobserver-loop-completed-with-undelivered-notification
        // See also https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded#answer-50387233
        runtimeErrors: (error) => {
          const ignoreErrors = [
            'ResizeObserver loop limit exceeded',
            'ResizeObserver loop completed with undelivered notifications.'
          ];
          if (ignoreErrors.includes(error.message)) {
            return false;
          }
          return true;
        },
        warnings: false,
        errors: true
      }
    },
    hot: true,
    host: '0.0.0.0',
    port: 8081,
    open: true
  },

  chainWebpack: config => {
    config.resolve.alias.set('vue', '@vue/compat');
    config.resolve.alias.set('APP', path.resolve(config.resolve.alias.get('@'), '../app'));

    config.when(process.env.NODE_ENV === 'development', (config) =>
      config.devtool('inline-cheap-module-source-map')
    )

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 3
            }
          }
        };
      });

    // Added to remove some warnings in Vue 3.4+
    // See https://vuejs.org/api/compile-time-flags#vue-cli
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      });
      return definitions;
    });

    return config
      .plugin('copy')
      .tap(options => {
        options[0].patterns[0].from = path.resolve(options[0].patterns[0].from, '../app/static');
        options[0].patterns[0].to = process.env.NODE_ENV === 'production'
          ? path.resolve(options[0].patterns[0].to, '../dist/static')
          : 'static';
        return options;
      });
  },

  configureWebpack: config => {
    // Tweak configuration options for Karma test runner to produce a bundle
    // which can run under Chrome headless. Avoid warnings due to custom entries
    // and customized filenames. Enable correct code coverage of .vue files.
    // Disable Vuetify treeshaking.
    // Ensure build is sent to a temporary directory and keep only necessary plugins.
    if (process.env.NODE_ENV === 'test') {
      const PLUGINS_TO_KEEEP = [
        'Plugin',
        'DefinePlugin',
        'CaseSensitivePathsPlugin',
        'FriendlyErrorsWebpackPlugin'
      ];

      config.devtool = 'eval';
      config.optimization.runtimeChunk = false;
      config.optimization.splitChunks = false;
      config.plugins = config.plugins.filter(plugin =>
        PLUGINS_TO_KEEEP.includes(plugin.constructor.name)
      );
      delete config.target;
      delete config.entry;
      delete config.output.filename;
      delete config.output.path;
    }
  },

  // Disable dependencies transpilation as browsers currently targetted by
  // .browserlistrc doesn't need it anymore. If legacy browsers need to be supported
  // modules to be processed can be granularly specified here.
  transpileDependencies: false,

  // Needed by vue-cli-plugin-vuetify to generate configuration correctly.
  pluginOptions: {
    vuetify: {}
  }
});
