const path = require('path')
const { defineConfig } = require('@vue/cli-service')

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = defineConfig({
  assetsDir: 'static',
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
        warnings: false,
        errors: true
      }
    },
    hot: true,
    host: 'localhost',
    port: 8081,
    open: true
  },

  chainWebpack: config => {
    config.resolve.alias.set('APP', path.resolve(config.resolve.alias.get('@'), '../app'))

    return config
      .plugin('copy')
      .tap(options => {
        options[0].patterns[0].from = path.resolve(options[0].patterns[0].from, '../app/static')
        options[0].patterns[0].to = process.env.NODE_ENV === 'production'
          ? path.resolve(options[0].patterns[0].to, '../dist/static')
          : 'static'
        return options
      })
  },

  configureWebpack: config => {
    // Tweak configuration options for Karma test runner to produce a bundle
    // which can run under Chrome headless. Avoid warnings due to custom entries
    // and customized filenames. Enable correct code coverage of .vue files.
    if (process.env.NODE_ENV === 'test') {
      config.devtool = 'eval'
      config.optimization.runtimeChunk = false
      config.optimization.splitChunks= false
      delete config.entry
      delete config.output.filename
    }
  },

  // Disable dependencies transpilation as browsers currently targetted by
  // .browserlistrc doesn't need it anymore. If legacy browsers need to be supported
  // modules to be processed can be granularly specified here.
  transpileDependencies: false
})
