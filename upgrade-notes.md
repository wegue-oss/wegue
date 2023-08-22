# Upgrade Notes

## v1 -> v2

### OpenLayers

This lists some essentials, which had to be adapted in the Wegue code regarding to the upgrade to OpenLayers in version 7:

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
