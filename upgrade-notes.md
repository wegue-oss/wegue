# Upgrade Notes

## v1 -> v2

### Vue-CLI

This lists some essentials, which had to be adapted in the Wegue code regarding to the upgrade to Vue-CLI in version 5.0.7:

- The command used to run the dev build is now `npm run serve`.
- Some new config files are present in the root directory. Take particular attention to `vue.config.js` used to configure the build process and `jsconfig.json` to configure `IDEs` integration.
- The main `HTML` template files which were present in the root directory are now in a `public` subfolder. Please adapt them to the needs of your Wegue application.
- The build configuration which was previously made inside the `build` and `config` directories should be placed in the `vue.config.js` file. Please adapt it to the needs of your Wegue application.  
The original `build` and `config` directories can be removed once this is done.
- Environment variables defined inside the `.env.js` files inside the `config` directory should be placed in `.env` files in the root directory.  
`dev.env.js` should now be called `.env.development`, `prod.env.js` should now be called `.env.production` and `test.env.js` should now be called `.env.test`.  
Please note than only `NODE_ENV`, `BASE_URL` and variables that start with `VUE_APP_` will be statically embedded into the client bundle. Please rename your variables in your Wegue application in case you use them after the build process.

Please refer to the official [Vue-CLI Guide](https://cli.vuejs.org/guide/) and [vue.config.js reference](https://cli.vuejs.org/config/#vue-config-js) when you upgrade your Wegue app.

If you're using environment variables inside your Wegue app, please read [Vue-CLI's Modes and Environment Variables Guide](https://cli.vuejs.org/guide/mode-and-env.html) carefully before updating your app.

`Vue-CLI` uses `Webpack 5` and `webpack-chain 6.5.1` under the hood. Please refer to [Vue-CLI's Working with Webpack guide](https://cli.vuejs.org/guide/webpack.html), [Webpack configuration guide](https://webpack.js.org/configuration/) and [webpack-chain documentation](https://github.com/neutrinojs/webpack-chain/tree/v6.5.1) if advanced configuration is needed inside your Wegue app.

### OpenLayers

This lists some essentials, which had to be adapted in the Wegue code regarding to the upgrade to OpenLayers in version 7:

- OL `Overlay` no longer accepts `autoPanAnimation` as an option.
 Now the animation delay is passed as an object directly to the autoPan option.
- `map.forEachLayerAtPixel()` is removed. Replaced with e.g. `map.getLayers().forEach()`.

Please have a look at the official [OpenLayers upgrade notes](https://github.com/openlayers/openlayers/releases/tag/v7.0.0), when you upgrade your Wegue app.

### Vuetify

This lists some essentials, which had to be adapted in the Wegue code regarding to the upgrade to Vuetify in version 2.6.15:

- The component `<v-content>` was renamed to `<v-main>`. Please adapt this in the `WguAppTemplate.vue` file of your Wegue application.

### MDI Icons

The MDI icon libraries used were upgraded to the following versions:

- `@mdi/font` => 7.2.x
- `material-icons` => 1.13.x

Please refer to the [official changelog](https://pictogrammers.com/docs/library/mdi/releases/changelog/) for versions later than `5.9.55` and check if you are using `removed` or `renamed` icons. Those have to be adapted and/or replaced in your Wegue application.
