# modules

JSON configuration objects for Wegue modules.

## General

The `modules` object contains sub-objects, whereas the key is the identifier for the module and the value is the dedicated module configuration. For example:

```json
  "wgu-layerlist": {
    "target": "menu",
    "win": true,
    "draggable": false
  }
```

The following properties can be applied to all map module types:

| Property          | Mandatory | Meaning | Example |
|-------------------|-----------|---------|---------|
| target            | x | Where should the button to enable/disable the module be rendered. Valid options are `menu` or `toolbar` | `"target": "menu"`. |
| win               | x | Boolean value to mark if the module has a window as sub component to show addition module UI elements. | `"win": true"` |
| draggable         |   | Boolean value to enable a window module be draggable over the viewport. Only applies if `win` is set to `true`. **CAUTION: This feature is experimental and not recommended for production usage.** | `"draggable": false` |
| initPos           | | The initial position for the module window in absolute viewport coordinates. Only applies if `win` is set to `true`. | `"initPos": {"left": 8, "top": 74}` |
| darkLayout        |  | Boolean value to ensure that your module element (mostly a button) is rendered bright since your basic theme color is dark.  | `"darkLayout": true` |

## GeoCoder

Module identifier: `wgu-geocoder`

| Property                | Mandatory | Meaning | Example |
|-------------------------|-----------|---------|---------|
| minChars        |  | Minimum number of characters which has to be entered so the query is triggered  | `"minChars": 2` |
| queryDelay      |  | Delay in MS before a query is triggered | `"queryDelay": 200` |
| selectZoom      |  | Zoom level which is set when a result entry is selected | `"selectZoom": 16` |
| debug           |  | Boolean value to enable debug logs | `"debug": false` |
| placeHolder     |  | Place holder text for the textfield | `"placeHolder": "Search address"` |
| provider        |  | Key defining which geocoder provider should be used. Could be `osm`, `photon` or `opencage` | `"provider": "osm"` |
| providerOptions |  | Optional options which are passed to the geocoder provider | `"providerOptions": {"lang": "en-US", "countrycodes": "", "limit": 6}` |

## HelpWindow

Module identifier: `wgu-helpwin`

No additional config options besides the general ones.

## InfoClick

Module identifier: `wgu-infoclick`

No additional config options besides the general ones.

## LayerList

Module identifier: `wgu-layerlist`

No additional config options besides the general ones.

## MeasureTool

Module identifier: `wgu-measuretool`

| Property                | Mandatory | Meaning | Example |
|-------------------------|-----------|---------|---------|
| strokeColor             |  | Stroke color of the measured geometry (finished sketch). Takes a CSS3 compliant color value. | `"strokeColor": "#c62828"` |
| fillColor               |  | Fill color of the measured geometry (finished sketch). Takes a CSS3 compliant color value. | `"fillColor": "rgba(198,40,40,0.2)"`. |
| sketchStrokeColor       |  | Stroke color of the measurement sketch geometry (while measuring). Takes a CSS3 compliant color value. | `"sketchStrokeColor": "rgba(198,40,40,0.8)"`. |
| sketchFillColor         |  | Fill color of the measurement sketch geometry (while measuring). Takes a CSS3 compliant color value. | `"sketchFillColor": "rgba(198,40,40,0.1)"`. |
| sketchVertexStrokeColor |  | Stroke color of the vertex of the sketch geometry (while measuring). Takes a CSS3 compliant color value. | `"sketchVertexStrokeColor": "#c62828"`. |
| sketchVertexFillColor   |  | Fill color of the vertex of the sketch geometry (while measuring). Takes a CSS3 compliant color value | `"sketchVertexFillColor": "rgba(198,40,40,0.2)"`. |

## ZoomToMaxExtent

Module identifier: `wgu-zoomtomaxextent`

No additional config options besides the general ones.
