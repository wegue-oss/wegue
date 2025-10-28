# Upgrade Notes

## v2 -> v3

`Wegue` v3.x transited from `Vue 2` to `Vue 3` and from `Vuetify 2` to `Vuetify 3` which implies a lot of changes.

`Wegue` team tried to introduce as few changes as possible to make the transition as smooth as it can be.  
This means components are still written using the `Options API` for example.

To be compatible with all the required dependencies, minimal `node` version was raised to `v18.19.0` while minimal `npm` version was also raised to `v10.2.3`.

Changes that were applied on the files present in the [app-starter](https://github.com/wegue-oss/wegue/commits/master/app-starter) directory should also be applied to your custom files present in the `app` directory.  
Don't forget to apply the changes made to the `.browserlistrc`, `.eslintrc.js` and `vue.config.js` files in the root directory too!

### Vue

`Vue` was upgraded from v2.x to v3.x which implies a lot of breaking changes. Please refer to the official [Vue 3 Migration Guide](https://v3-migration.vuejs.org/), especially its [Breaking Changes part](https://v3-migration.vuejs.org/breaking-changes/) when you upgrade your `Wegue` app.

Comparing changes applied on the components present in the [app-starter](https://github.com/wegue-oss/wegue/commits/master/app-starter) directory should give you a good overview of what has to be done.

Here is a list of the essentials which had to be adapted in the `Wegue` code regarding to the upgrade of `Vue` to version 3.x:

- `<template v-for>` `key` attribute should be placed on the `<template>` tag now rather than on its children.
- `Vue` now has a concept of *app instance* which completely changes how global configuration can be approached. Some variables that were stored on the `Vue` prototype are now reachable from the *app instance* through `this` inside components.  
For example, the `application configuration` which was available through `Vue.prototype.$appConfig` can now be accessed using `this.$appConfig`.  
The same applies to `$appLanguage` and `$isEmbedded`.  
There is a limitation though as accessing the *app instance* is only possible inside components, not from plain `JavaScript` files.
- For the same reason, `ViewAnimationUtil` helper functions are now embedded inside a class with the known limitation that it can only be used inside of components.  
Some changes must be done if you were using those functions directly inside your application.  
  Something previously written like this:  
  > `ViewAnimationUtil.to(this.map.getView(), foundFeature.getGeometry());`

  Should be replaced by:
  > const viewAnimationUtil = new ViewAnimationUtil(this.$appConfig.viewAnimation);  
  viewAnimationUtil.to(this.map.getView(), foundFeature.getGeometry());
- `Vue` instances can no longer be used to create an *event bus*. `WguEventBus` was rewritten to make use of `tiny-emitter` because of that. This should be fully transparent, however, some edge cases could be encountered if very specific usage is made of it.
- `ColorTheme mixin` and `Mapable mixin` were rewritten as `composables`. What should be done to migrate those `mixins` to their `composable` counterparts is easier to see by example. Please take a look at the [ThemeSwitcher component](https://github.com/wegue-oss/wegue/blob/master/src/components/themeswitcher/ThemeSwitcher.vue) and the [BackgroundLayerSwitcher component](https://github.com/wegue-oss/wegue/blob/master/src/components/bglayerswitcher/BgLayerSwitcher.vue) respectively.  
For basic usage, migrating from the `ColorTheme mixin` should be limited to removing the `mixin` registration and adding the following two lines inside the `setup lifecycle hook`:
    > const { isDarkTheme, isPrimaryDark } = useColorTheme();  
    > return { isDarkTheme, isPrimaryDark };

  For basic usage, migrating from the `Mapable mixin` should be limited to removing the `mixin` registration, removing the layers retrieval inside the `onMapBound` method and adding the following two lines inside the `setup lifecycle hook`:
    > const { map, layers } = useMap();  
    > return { map, layers };

  Please also note that `onMapBound` and `onMapUnbound` are not fired anymore. If you'd like to work with them as before, you have to implement your own `watcher` on the `map` for that. You can refer to the [OverviewMapPanel component](https://github.com/wegue-oss/wegue/blob/master/src/components/overviewmap/OverviewMapPanel.vue) to get a full example.
- `portal-vue` plugin has been replaced by the inbuilt Vue3 feature [Teleport](https://vuejs.org/guide/built-ins/teleport.html). The anchor element in the AppTemplate is now a `div` with the id `wgu-map-teleport` and the syntax to hook up a teleport template has slightly changed:
    ```xml
    <template>
       <teleport to="#wgu-map-teleport">
           <!-- content goes here -->
       </teleport>
    </template>
    ```

Currently, the `Vue migration build` is used instead of the native `Vue 3` build. Because of this, usage of features that have changed or been deprecated in `Vue 3` will emit runtime warnings. This can be really useful while migrating an application and ensure everything was dealt with properly.

`Vue migration build` compatibility with `Vue 2` can be configured to suit your needs during the migration phase.  
Global configuration is made inside the [main.js file](https://github.com/wegue-oss/wegue/blob/master/src/main.js).  
Options which are compiler-specific can be configured inside the [vue.config.js file](https://github.com/wegue-oss/wegue/blob/master/vue.config.js).

To get more information about this build and how to configure it, please refer to the official [Vue 3 Migration Guide](https://v3-migration.vuejs.org/migration-build).

Usage of the `Vue migration build` will be removed for official `Wegue` v3 release.

### Vuetify

`Vuetify` was upgraded from v2.x to v3.x which implies a lot of breaking changes. Please refer to the official [Vuetify 3 Upgrade Guide](https://vuetifyjs.com/en/getting-started/upgrade-guide/#upgrade-guide) when you upgrade your `Wegue` app.

Comparing changes applied on the components present in the [app-starter](https://github.com/wegue-oss/wegue/commits/master/app-starter) directory should give you a good overview of what has to be done. There were so many changes in the APIs though that each component should be addressed separately. This will certainly be the most tedious part of migrating a complete `Wegue` app.

Here is a list of the essentials which had to be adapted in the `Wegue` code regarding to the upgrade of `Vuetify` to version 3.x:

- `Material Icons` now need the `md:` prefix added to their name. For example, `chevron_left` is now called `md:chevron_left`.  
`MDI` keep their name unchanged. For example, `mdi-menu-left` has still the same name.  
Please update icon names accordingly inside your **app code** and inside your **configuration files**.
- `onprimary` and `onsecondary` colors are now called `on-primary` and `on-secondary` respectively. Please update your configuration files accordingly.  
Take also note that the `accent` and `anchor` colors were removed while some others such as `surface` have been added by default. You can refer to the official [Theme configuration page](https://vuetifyjs.com/en/features/theme/) for more information. Also keep in mind that you can still create custom colors and are not limited to the standard ones.  
-  Custom icons format has slightly changed, their definition should now begin with `svg:` and they can be referenced using `$myIconName`.  
For example, an icon which was defined as `export default 'M 23.16738,3.1894921 18.478314,20.810508 H ... L 20.847525,3.1894921 Z'` should now de defined as `export default 'svg:M 23.16738,3.1894921 18.478314,20.810508 H ... L 20.847525,3.1894921 Z'`. If this was defined inside a file called `app/custom-icons/WLetter.js`, it was displayed using `$vuetify.icons.WLetter` as a name. If the file name hasn't changed, it is now displayable using `$WLetter` as a name.  
Please update your app code and configuration files accordingly.

### ESLint

`ESLint` and its associated plugins were upgraded to the following versions:

- `eslint` => 8.57.x
- `eslint-plugin-vue` => 9.32.x
- `eslint-plugin-vuetify` => 2.5.x
- `eslint-config-standard` => 17.1.x
- `@vue/eslint-config-standard` => 8.0.x

As some linting rules were added or changed, you should expect to see error and warnings the first time you will build your updated `Wegue` app.  
The majority of those can be fixed automatically by running the `npm run lint:fix` command.  
If you want to momentarily bypass some advanced errors to test your upgraded app or want to adapt linting rules to better suit your preferences, you can modify the `.eslintrc.js` file as needed.

### Other Changes

`mapGeodataDragDop` property of the main `Wegue` application configuration was renamed `mapGeodataDragDrop`. Please update your configuration files accordingly.

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

This lists some essentials, which had to be adapted in the Wegue code regarding to the upgrade to OpenLayers in version 7/8/9:

- OL `Overlay` no longer accepts `autoPanAnimation` as an option.
 Now the animation delay is passed as an object directly to the autoPan option.
- `map.forEachLayerAtPixel()` is removed. Replaced with e.g. `map.getLayers().forEach()`.

Please have a look at the official [OpenLayers upgrade notes](https://github.com/openlayers/openlayers/blob/main/changelog/upgrade-notes.md), when you upgrade your Wegue app. Especially look for any breaking change between OpenLayers v6.4.3 and the current OpenLayers version used in Wegue v2, see [package.json](https://github.com/wegue-oss/wegue/blob/master/package.json).

### Vuetify

This lists some essentials, which had to be adapted in the Wegue code regarding to the upgrade to Vuetify in version 2.6.15:

- The component `<v-content>` was renamed to `<v-main>`. Please adapt this in the `WguAppTemplate.vue` file of your Wegue application.

### MDI Icons

The MDI icon libraries used were upgraded to the following versions:

- `@mdi/font` => 7.2.x
- `material-icons` => 1.13.x

Please refer to the [official changelog](https://pictogrammers.com/docs/library/mdi/releases/changelog/) for versions later than `5.9.55` and check if you are using `removed` or `renamed` icons. Those have to be adapted and/or replaced in your Wegue application.

### ESLint

ESLint and its associated plugins were upgraded to the following versions:

- `eslint` => 7.32.x
- `eslint-plugin-standard` => 4.1.x
- `eslint-plugin-vue` => 7.20.x
- `eslint-config-standard` => 16.0.x
- `@vue/eslint-config-standard` => 6.1.x

As lots of new linting rules were added, you should expect to see error and warnings the first time you will build your updated Wegue app.  
The majority of those can be fixed automatically by running the `npm run lint:fix` command.  
If you want to momentarily bypass some advanced errors to test your upgraded app or want to adapt linting rules to better suit your preferences, you can modify the `.eslintrc.js` file as needed.
