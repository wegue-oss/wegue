# Reusable components

Wegue provides a set of reusable Vue / Vuetify components, which can be customized to accomplish frequent tasks in a web mapping application.

## Map overlay

Component identifier: `wgu-map-overlay`

Implemented in : `src/components/modulecore/MapOverlay.vue`

An element to be displayed over the map and attached to a map location. Overlays are not in a fixed position on the screen, but are tied to a geographical coordinate, so panning the map will move an Overlay. 
This is a Vue wrapper for [native OpenLayers overlays](https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html). 

Overlays can either be statically positioned or can be used to implement a custom tooltip associated with feature of a layer. The latter is dynamically positioned and displayed when a feature is hovered. To hook up a customized feature hover tooltip, the value of the `overlayId` property in your overlay implementation can be referenced by the `hoverOverlay` property declared in the map layer configuration. For more information see the description of the `hoverable`, `hoverAttribute` and `hoverOverlay` properties in the [map configuration section](map-layer-configuration?id=general).


### Props

| Name               | Type | Default | Description   | Example |
|--------------------|:-----|:--------|:--------------|:--------|
| overlayId          | string  |          | Unique identifier for the overlay. If the overlay is used as a feature hover tooltip, this ID must be referenced by the `hoverOverlay` property in the [map configuration](map-layer-configuration?id=general). | `overlayId="my-custom-overlay"` |
| visible            | boolean | true     | Whether the overlay is initially visible. If the overlay is used as a feature hover tooltip for layers, it is dynamically displayed and this value should be set to `false`.  | `:visible=true` |
| offset             | array   | [0,0]       | Offsets in pixels used when positioning the overlay. The first element in the array is the horizontal offset. A positive value shifts the overlay right. The second element in the array is the vertical offset. A positive value shifts the overlay down. | `:offset= "[0,20]"` |
| positioning        | string  | 'top-left' | Defines how the overlay is actually positioned with respect to its position property. Possible values are `'bottom-left'`, `'bottom-center'`, `'bottom-right'`, `'center-left'`, `'center-center'`, `'center-right'`, `'top-left'`, `'top-center'`, and `'top-right'`. | `positioning="top-center"`
| coordinates        | array   | undefined | The overlay position in map projection. If the overlay is used as a feature hover tooltip for layers, it is dynamically positioned and this value should be omitted. | `:coordinates="[967600, 6344720]"`
| autoPan            | boolean | false     | Pan the map when positioning the overlay, so that the overlay is entirely visible in the current viewport. If `true`, then `autoPanDuration` will be used to determine the panning duration. | `:autoPan=true`
| autoPanDuration    | number | 0          | The duration of the pan animation in milliseconds. This value is only used when `autoPan` is enabled. | `:autoPanDuration="250"`

### Slots

| Name               | Description |
|--------------------|:------------|
| default            | The default vue slot. If the overlay is used as feature hover tooltip, a data object with the following properties is available from the slot scope: |

```javascript
{ 
  feature:  ol/Feature,
  hoverAttribute: string
}
```

### Examples

#### Statically positioned overlay

The follow example positions a static overlay at Heidelberg - assuming `EPSG:3857` is used as map projection. The default slot of `<wgu-map-overlay>` is filled by a `<v-sheet>` which deplays the overlay content.

```javascript
<template>
  <wgu-map-overlay
    overlayId="my-static-overlay"
    :coordinates="[967600, 6344720]"
  >
    <v-sheet class="pa-2"> 
      Welcome to Heidelberg
    </v-sheet>
  </wgu-map-overlay>
</template>

<script>
import MapOverlay from '../src/components/modulecore/MapOverlay.vue'
export default {
  name: 'my-static-overlay',
  components: {
    'wgu-map-overlay': MapOverlay
  }
}
</script>
```

#### Feature hover tooltip
The following example implements a customized feature hover tooltip, to render an attribute of a feature.

```javascript
<template>
  <wgu-map-overlay
    overlayId="my-custom-tooltip"
    :visible=false
  >
   <!-- Do the rendering of your feature in the default slot.
        A data object with "feature" and optionally "hoverAttribute" properties
        is available from the slot-scope -->
    <v-sheet slot-scope="{feature}"> 
      {{ feature.get('my-feature-attribute') }}
    </v-sheet>
  </wgu-map-overlay>
</template>

<script>
import MapOverlay from '../src/components/modulecore/MapOverlay.vue'
export default {
  name: 'my-custom-tooltip',
  components: {
    'wgu-map-overlay': MapOverlay
  }
}
</script>
```

Associate it with a layer by means of the `hoverOverlay` attribute in your [map layer configuration](map-layer-configuration?id=general). The value should match the value of the `overlayId` property declared above:
```JSON
 "mapLayers": [
     {
      "type": "VECTOR",
      "lid": "earthquakes",
      "url": "./static/data/2012_Earthquakes_Mag5.kml",
      "hoverable": true,
      "hoverOverlay": "my-custom-tooltip"
    }
 ]
```








