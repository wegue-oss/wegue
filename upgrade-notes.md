# Upgrade Notes

## v1 -> v2

### OpenLayers

This lists some essentials, which had to be adapted in the Wegue code regarding to the upgrade to OpenLayers in version 7:

- OL `Overlay` no longer accepts `autoPanAnimation` as an option.
 Now the animation delay is passed as an object directly to the autoPan option.
- `map.forEachLayerAtPixel()` is removed. Replaced with e.g. `map.getLayers().forEach()`.

Please have a look at the official [OpenLayers upgrade notes](https://github.com/openlayers/openlayers/releases/tag/v7.0.0), when you upgrade your Wegue app.

### Vuetify

This lists some essentials, which had to be adapted in the Wegue code regarding to the upgrade to Vuetify in version 2.6.15:

- The component `<v-content>` was renamed to `<v-main>`. Please adapt this in the `WguAppTemplate.vue` file of your Wegue application.
