# Wegue configuration

This describes the Wegue application configuration, which is modelled as JSON document. The **bold properties** are mandatory.

## Properties

### General

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| colorTheme          | Vuetify theme configuration | See [colorTheme](#colorTheme) |
| logo               | URL to an image shown as application logo | ` "logo": "https://dummyimage.com/100x100/aaa/fff&text=Wegue"`
| logoWidth          | Width of the application logo defined in `logo` | `"logoWidth": "200"`|
| logoHeight         | Height of the application logo defined in `logo` | `"logoWidth": "100"` |
| logoSize           | Squared size of the application logo defined in `logo`. Only has an effect if `logoWidth` and `logoHeight` are **not** set. Otherwise these will overwrite the `logoSize` setting. | `"logoSize": "100"` |
| showCopyrightYear  | Boolean value, whether the copyright year should be shown on the right side of the toolbar | `"showCopyrightYear": true` or `"showCopyrightYear": false` |
| lang | Configuration object for language settings of the application | See [lang](wegue-configuration?id=lang)
| **mapZoom**        | Initial zoom level of the map | `"mapZoom": 2` |
| **mapCenter**      | Initial center of the map in map projection | `"mapCenter": [0, 0]` |
| mapProjection      | Configuration object for CRS / projection used for the map | see [mapProjection](wegue-configuration?id=mapprojection) |
| mapGeodataDragDop  | Configuration object for geodata file drag/drop functionality on the map. Only by setting the config this function will be enabled. | see [mapGeodataDragDop](wegue-configuration?id=mapGeodataDragDop) |
| mapHover           | Configuration object containing application wide parameters for hover tooltips on the map. | see [mapHover](wegue-configuration?id=mapHover)
| **modules**        | Array of module configuration objects | See [modules](module-configuration) |
| **mapLayers**      | Array of map layer configuration objects | See [mapLayers](map-layer-configuration) |
| overviewMap        | Configuration object for the overview map. | See [overviewMap](wegue-configuration?id=overviewMap)
| permalink          | Configuration object for permanent links. | See [permalink](wegue-configuration?id=permalink)
| projectionDefs     | Array of CRS / projection definition objects compatible to proj4js | See [projectionDefs](wegue-configuration?id=projectiondefs) |
| tileGridDefs       | Array of tile grid definition objects | See [tileGridDefs](wegue-configuration?id=tilegriddefs) |
| viewAnimation      | Configuration object for view animations | See [viewAnimation](wegue-configuration?id=viewAnimation) |
| sidebar            | Configuration object for the application sidebar. | See [sidebar](wegue-configuration?id=sidebar) |
| legend             | Configuration object containing application wide parameters for layer legends. | See [legend](wegue-configuration?id=legend) |

### colorTheme

Wegue supports the Vuetify (light and dark) theme configuration out of the box. This property expects a json object with the same format described in the [vuetify documentation](https://v2.vuetifyjs.com/en/features/theme/#customizing).

Example:
```json
"colorTheme": {
  "dark": false, // Start with dark theme on
  "themes": {    // Configuration for themes
    "light": {   // Light theme configuration
      "primary": "#af2622",
      "on-primary": "#ffffff",
      "secondary": "#ec483b",
      "on-secondary": "#ffffff",
      "error": "#ff6f00"
    },
    "dark": {    // Dark theme configuration
      "primary": "#272727",
      "on-primary": "#ffffff",
      "secondary": "#ea9b9b",
      "on-secondary": "#272727",
      "error": "#ff6f00"
    }
  }
},
```

Each theme configuration contains the following classes of colors:

| Color         | Description         | Example       |
| ------------- |:-------------------:| ------------- |
| primary       | color for main UI components             | Header, Footer |
| secondary     | color to accent selected parts of the UI | Floating buttons, selection controls, progress bars   |
| info          | semantic color for information           | Used in components that display information messages  |
| success       | semantic color for success               | Used in components that display success messages      |
| warning       | semantic color for warning               | Used in components that display warning messages      |
| error         | semantic color for error                 | Used in components that display error messages        |


In addition, Wegue also supports the following "on" colors:

| Color         | Description         | Example       |
| ------------- |:-------------------:| ------------- |
| on-primary     | color over primary color   | typography/icons over primary color   |
| on-secondary   | color over secondary color | typography/icons over secondary color |

Moreover, custom colors which are not listed in the Vuetify documentation can also be defined here. Lighten and darken variants will also be generated for them like for the default ones.

To simplify the theming configuration, if the "themes" property isn't configured, Wegue will fallback to the default colors in the example above. Otherwise, both the "light" and "dark" themes will be built based on the respective configured colors. The following tables specify which colors are mandatory and their respective default values.

#### Light theme:

| Color         | Mandatory | Default             |
| ------------- |:---------:|:-------------------:|
| primary       | yes |       - |
| secondary     |  no | primary |
| information   |  no | #2196F3 |
| success       |  no | #4CAF50 |
| warning       |  no | #FFC107 |
| error         |  no | #FF5252 |
| on-primary     |  no | white if primary is a dark color. <br/> black if primary is a light color     |
| on-secondary   |  no | white if secondary is a dark color. <br/> black if secondary is a light color |

#### Dark theme:

| Color         | Mandatory | Default             |
| ------------- |:---------:|:-------------------:|
| primary       |   - | #272727 |
| secondary     | yes |       - |
| information   |  no | #2196F3 |
| success       |  no | #4CAF50 |
| warning       |  no | #FFC107 |
| error         |  no | #FF5252 |
| on-primary     |  no | white if primary is a dark color. <br/> black if primary is a light color     |
| on-secondary   |  no | white if secondary is a dark color. <br/> black if secondary is a light color |

Note that there is a clear asymmetry in the "light" and "dark" theme configuration. In the "light" theme, the primary color is mandatory and all the
others are derived from that. In the "dark" theme, the predominant color must be a shade of black (to comply with the [material design specification](https://material.io/design/color/dark-theme.html)), so the primary color is locked to `#272727`. Therefore, in this case the colors are derived from the second predominant color.

#### Tips on creating a color theme

In this section we offer a couple of tips on choosing colors for Wegue while meeting the [material design principles](https://material.io/design/color/the-color-system.html#color-usage-and-palettes) (hierarchy/legibility/expressiveness).

For simplicity, we will prioritize the colors for the "light" theme and adapt the "dark" theme accordingly. To select colors, we advise the use of [this material design color picker](https://material.io/design/color/the-color-system.html#tools-for-picking-colors) as it shows the color tone levels (the scale underneath each palette). This scale is the key to adjust the contrast of colors for better legibility.

And last but not least, building a theme is a very opinionated matter and therefore the following tips serve only as guidelines for Wegue.

#### Choosing the primary color:

Being the predominant color, the primary color is used to express the "story" that Wegue should tell. Our suggestion is to evaluate the nature of the geographical data that Wegue will display and then pick a color that balances well with that nature.

| Light theme | Dark theme |
| ----------- | ---------- |
| Any tone in the color palette is valid. | As referred in the previous section ([colorTheme](#colorTheme)), the primary color in the dark theme is locked to `#272727` to meet the material design standards. |

#### Choosing the secondary color:

Wegue uses the secondary color to accent selected parts of the UI. Everything between selection controls, floating buttons, progress bars and any component that can be interacted with. The idea is to pick a color that has a good balance with the primary, in a way that creates a sense of hierarchy for the UI components.

| Light theme | Dark theme |
| ----------- | ---------- |
| A tone from the same scale as the primary (for a monotone scheme). <br/> Or a "complementary", "analogous" or "triadic" color from the color picker tool. | We suggest picking the 200 tone of the primary color. Picking a light variant will contrast well with the dark interface in most cases. |

#### Choosing the "on" colors:

The "on" colors are additional UI colors placed over the main colors. Wegue uses this class of colors to improve the legibility of typography/iconography over primary and secondary colors.

The rule of thumb is simple:
* if the main color is a dark tone, white or the 50 tone of the main color are safe choices;
* if the main color is a light tone, black or the 700 tone of the main color.

#### Edge cases:

In some cases, the primary/secondary color may collide with the semantic colors (information, success, warning, error). This is undesirable as the UI will not be able to sufficiently stand out relevant messages from the surrounding components.

The idea is the override the collided colors with a different tone that will deliver the same semantic feeling. As an example, the default color theme of Wegue is built based on a red tone, which collides with the semantic color for errors. To avoid collision, Wegue adapts the same strategy as in the [Crane material study](https://material.io/design/material-studies/crane.html#color) and sets an orange tone for errors.

### projectionDefs

The property `projectionDefs` is a nested array holding several [proj4js](https://proj4js.org) compatible projection definitions. For each array element the first item is the projection code and the second item is the [proj4](https://proj4.org) definition string. For example:

```json
[
    "EPSG:28992",
    "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs"
]
```
Projection definitions can be found at [epsg.io](http://epsg.io). The definition in the example above would therefore be available at http://epsg.io/28992.

### mapProjection

The property `mapProjection` defines the CRS, which is used by the map in your Wegue application. The `mapProjection` object has the following properties:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **code**           | The code of the SRS to be used for the map. In case it is not `EPSG:4326` or `EPSG:3857` it has to be defined in the [projectionDefs](wegue-configuration?id=projectiondefs) | `"code": "EPSG:28992"` |
| **units**          | The unit of the SRS | `"units": "m"` |
| **extent**         | The validity extent for the SRS | `"extent": [-285401.920, 22598.080, 595401.920, 903401.920]` |

### tileGridDefs

By default Wegue (OpenLayers) assumes the "OSM/Google" Web Mercator tilegrid. Different tilegrids can be defined once and then referenced in Layer configurations.
Below is an example for the Dutch Standard Tilegrid:

```json
"tileGridDefs": {
    "dutch_rd": {
      "extent": [-285401.920, 22598.080, 595401.920, 903401.920],
      "resolutions": [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210],
      "tileSize": [256, 256]
    }
  }
 ```
 One or more tilegrids can be defined. The tilegrid's name is arbitrary, above `dutch_rd`, and can be used as a key when refered in in a Layer configuration.
 Each tilegrid definition has the following properties:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **extent**         | The extent of the tilegrid as a bounding box using the SRS of the Map| `"extent": [-285401.920, 22598.080, 595401.920, 903401.920]` |
| **resolutions**    | The resolutions for the tilegrid (related to zoomlevels) as an array | `"resolutions": [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520]` |
| **tileSize**       | The tilesize in width/height pixels | `"tileSize": [512, 512]` |

In a Layer configuration a specific tilegrid can be refered to as follows, using the `tileGridRef` property:

```
    {
      "type": "XYZ",
      "lid": "brtachtergrondkaart",
      "url": "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:28992/{z}/{x}/{y}.png",
      "projection": "EPSG:28992",
      "tileGridRef": "dutch_rd",
      "isBaseLayer": true,
      "visible": true,
      "crossOrigin": "anonymous"
    }
```

### mapGeodataDragDop

Setting the property `mapGeodataDragDop` in the main Wegue configuration will enable geodata file drag/drop functionality on the map.

The following configurations can be set:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| formats            | Allowed geodata formats, which can be  dropped to the map. Supported formats are `"GeoJSON"`, `"KML"`, `"GPX"`, `"IGC"` and `"TopoJSON"` | `"formats": ["GeoJSON", "KML"]`
| zoomToData         | Enable automatic zoom to the extent of the uploaded / dropped geodata. Defaults to `false` | `"zoomToData": true` |
| replaceData        | Default behaviour is that a newly dropped data set will replace an existing one. By setting this property to `true` a separate layer will be created for each dropped geodata file | `"replaceData": true` |
| displayInLayerList | List the layer(s) showing dropped data in the LayerList UI. Defaults to `true`  | `"displayInLayerList": false` |
Below is an example for such a configuration object:

```
    {
      "formats": ["GeoJSON", "KML"],
      "zoomToData": true,
      "replaceData": true,
      "displayInLayerList": true
    }
```

### mapHover

Wegue allows for customized tooltips that display one or multiple attributes of a feature when it is hovered over on the map. The optional `mapHover` property in the main Wegue configuration specifies application-wide parameters for tooltip behavior. This property affects only layers with the `hoverable` attribute set to `true` - refer to the [mapLayers](map-layer-configuration) section for more details.
The following properties are supported:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| delay              | Timespan in milliseconds, by which displaying the tooltip is deferred after the mouse pointer rests. Defaults to `150`. | `"delay": 150`
| hideOnMousemove    | Hide the tooltip when the mouse cursor is moved. Defaults to `false`. | `"hideOnMousemove": false`
| hoverOverlay       | ID of a custom map overlay to use as a default display when a feature of a layer is hovered. Declaration of the `hoverOverlay` property on a mapLayer level takes precedence. For more information on how to implement a map overlay see the [reusable components](reusable-components?id=map-overlay) section. Defaults to Wegue's default tooltip `wgu-hover-tooltip` |  `"hoverOverlay": "my-custom-overlay"`

Example:

```json
"mapHover":
    {
      "delay": 150,
      "hideOnMousemove": false,
      "hoverOverlay": "my-custom-overlay"
    }
```


### lang

Wegue comes with multi-language support and currently supplies 2 language packs for English (`en`) and German (`de`). Languages supported by the application can be configured via the `lang` property. Wegue will automatically detect the users preferred languages from the browser settings and choose the most appropriate match. If no languages are configured, Wegue will default to English.


| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| supported          | Supported languages of the application. This is a set of key value pairs containing the language code as a key and a friendly name for the language as a value. | `"supported": {"en": "English", "de": "Deutsch"}`
| fallback           | The language code of the language to fall back to, when the users preferred languages are not among the supported ones. | `"fallback": "en"`

Below is an example for such a configuration object:
```
"lang": {
    "supported": {
      "en": "English",
      "de": "Deutsch"
    },
    "fallback": "en"
  }
```

### legend

Wegue supports rendering of layer legend images, which will be displayed in the [LayerList module](module-configuration?id=LayerList). The optional property `legend` in the main Wegue configuration provides sensible defaults to legend request parameters for all layers in the application. This can be useful e.g. for parameters like fonts, font-sizes and other common options, which you want to share between all legends.

Supported options may be vendor specific, e.g. see [GeoServer Docs](https://docs.geoserver.org/latest/en/user/services/wms/get_legend_graphic/index.html) for the options supported for WMS layers in GeoServer.

Example:
```json
  "legend": {
    "transparent": true,
    "width": 14,
    "height": 16,
  }
```

Alternatively you can specify legend request parameters on a per layer basis, by assigning a layers `legendOptions` attribute - see [mapLayers](layer-configuration?id=General).
Settings for the individual layers are merged with the application wide option, while the specific layer setting takes precedence.

For information on how to enable and customize legends for specific layers, see the documentation of [mapLayers](layer-configuration?id=General).

### viewAnimation

Map views can be animated, to zoom or pan from the current to a target location, typically after a user action takes place. This can be configured by the property `viewAnimation` in the main Wegue configuration. Per default animations are disabled.

The following configurations can be set:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| type               | The animation type. Supported values are `"none"`, `"fly"`, `"pan"` and `"bounce"`. Defaults to `"none"` | `"type": "fly"` |
| options            | Configuration object to customize the behavior of the animation. | See the [options](wegue-configuration?id=options) below |

#### options

Animations can be customized by specific options. Not all options are supported by each animation type.

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| duration        | Duration of the animation in ms. Ignored if the animation type is `"none"`. Currently defaults to 3000 ms for all other animations. | `"duration": 3000` |
| zoom | The final zoom level when moving to a coordinate or point. This setting is ignored if the destination of the animation is an extent or non-point geometry.  | `"zoom": 15` |
| maxZoom | The maximum zoom level that the animation is allowed to zoom in on the destination. | `"maxZoom": 15` |

Below is an example for an animation configuration object:

```
  "viewAnimation": {
    "type": "fly",
    "options": {
      "duration": 3000,
      "zoom": 15,
      "maxZoom": 15
    }
  }
```


### sidebar
The optional `sidebar` property customizes the behavior and layout of the application sidebar. Wegue's sidebar will be implicitly enabled, if at least one module is configured to use the sidebar as a window target, as specified by `"win"="sidebar"` - see the general section of the [Module Configuration](module-configuration?id=General).

The `sidebar` object supports the following properties:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| width              | Width of the sidebar in pixels. Defaults to 400px.  | `"width": 400` |
| minWidth           | Minimal width of the sidebar in pixels. This option will only take effect if the `resizable` option is enabled. | `"minWidth": 400` |
| maxWidth           | Maximal width of the sidebar in pixels. This option will only take effect if the `resizable` option is enabled.   | `"maxWidth": 600` |
| visible            | Specifies whether the sidebar appears in open or closed state on application start. Defaults to true. | `"visible": true` |
| autoScroll         | Whether to automatically scroll the sidebar to the active module. Defaults to true. | `"autoScroll": true` |
| scrollDuration     | Animation duration in milliseconds to automatically scroll the sidebar to the active module. Defaults to 500ms. | `"scrollDuration": 500` |
| resizable          | Specifies whether the sidebar's width can be adjusted. Defaults to false. | `"resizable": true`

Below is an example for a sidebar configuration object:

```
  "sidebar": {
    "visible": true,
    "width": 400,
    "minWidth": 400,
    "maxWidth": 600,
    "autoScroll": true,
    "scrollDuration": 500,
    "resizable": true,
  }
```

### overviewMap
Wegue integrates an overview map control, if the optional `overviewMap` property is declared.

The `overviewMap` object supports the following properties:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| icon               | Provide a customized map icon. Defaults to `md:zoom_out_map`.  | `"icon": "md:zoom_out_map"` |
| visible            | Specifies whether the overviewMap appears in open or closed state on application start. Defaults to true. | `"visible": true` |
| rotateWithView     | Whether the control view should rotate with the main map view. Defaults to true. | `"rotateWithView": true` |
| width              | Width of the overview map panel in viewport coordinates. Defaults to 164px.  | `"width": 164` |
| height             | Height of the overview map panel in viewport coordinates. Defaults to 178px.  | `"height": 178` |

Below is an example for an overview map configuration object:


```
  "overviewMap": {
    "visible": true,
    "rotateWithView": true,
    "width": 164,
    "height": 178
  }
```

### permalink

Wegue supports permanent links, which are URLs intenteded to remain unchanged and to be shared on the web. Wegue allows customization of its permalink URL encoding behaviour by the `permalink` property.

The following configurations can be set:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| location          | Whether to encode permalink attributes as part of the hash ('#' separator) or query string portion ('?' separator) of the URL. Defaults to query string portion.  | `"location": "hash"`
| layers            | Include the visible state of layers. Defaults to `false` | `"layers": true`
| extent            | Include the currently visible extent of layers. Defaults to `false` | `"extent": false`
| projection        | Projection used to encode layer coordinates. Defaults to the global `mapProjection` | `"projection": "EPSG:4326"`
| paramPrefix       | Additional prefix when encoding parameters. Per default no prefix is used. | `"paramPrefix": ""`
| history           | Specifies whether to append UI interactions resulting in a permalink change to the browser history. Defaults to `false`. | `"history": true`
| precision         | Decimal precision when encoding numeric parameters, e.g. layer coordinates. Defaults to `4`. | `"precision": 4`

Below is an example for an permalink configuration object:

```
  "permalink": {
    "location": "hash",
    "layers": true,
    "extent": false,
    "projection": "EPSG:4326",
    "paramPrefix": "",
    "history": true
  }
```
## Example configuration

Example configurations can be found in the `app-starter/static` directory. Below an example as used in the Demo:

```json
{

  "colorTheme": {
    "dark": false
  },

  "logo": "https://dummyimage.com/100x100/aaa/fff&text=Wegue",
  "logoWidth": "100",
  "logoHeight": "100",

  "showCopyrightYear": true,

  "lang": {
    "supported": {
      "en": "English",
      "de": "Deutsch",
      "pt": "Portugues",
      "fr": "Français"
    },
    "fallback": "en"
  },

  "mapZoom": 2,
  "mapCenter": [0, 0],
  "mapGeodataDragDop": {
    "formats": ["GeoJSON", "KML"],
    "zoomToData": true,
    "replaceData": true,
    "displayInLayerList": true
  },

  "overviewMap" : {
    "visible": false
  },

  "viewAnimation": {
    "type": "fly",
    "options": {
      "duration": 3000,
      "zoom": 15,
      "maxZoom": 15
    }
  },

  "permalink": {
    "location": "hash",
    "layers": true,
    "extent": false,
    "projection": "EPSG:4326",
    "paramPrefix": "",
    "history": true
  },

  "mapLayers": [

    {
      "type": "VECTOR",
      "lid": "Shops",
      "url": "./static/data/shops-dannstadt.geojson",
      "formatConfig": {
      },
      "format": "GeoJSON",
      "visible": true,
      "selectable": true,
      "style": {
        "radius": 4,
        "strokeColor": "purple",
        "strokeWidth": 2,
        "fillColor": "rgba(155,153,51,0.5)",
        "label": {
          "attribute": "name",
          "minResolution": 4.0,
          "outlineColor": "white",
          "outlineWidth": 2,
          "fillColor": "black",
          "offsetX": 0,
          "offsetY": 15,
          "align": "center"
        }
      },
      "columnMapping": {
        "name": "Name",
        "email": "Email",
        "website": "Website"
      },
      "selectStyle": {
        "radius": 10,
        "strokeColor": "gray",
        "strokeWidth": 5,
        "fillColor": "rgb(255, 255, 0, 0.2)"
      },
      "doAppendSelectStyle": true
    },
    {
      "type": "WFS",
      "lid": "gas-wfs",
      "url": "https://ows-demo.terrestris.de/geoserver/osm/wfs",
      "typeName": "osm:osm-fuel",
      "version": "2.0.0",
      "maxFeatures": 50,
      "formatConfig": {
      },
      "format": "GML3",
      "loadOnlyVisible": true,
      "visible": false,
      "selectable": true,
      "style": {
        "textIcon": "local_gas_station",
        "font": "normal 30px Material Icons",
        "fillColor": "blue"
      },
      "columnMapping": {
        "name": "Name"
      },
      "selectStyle": {
        "textIcon": "star",
        "font": "normal 30px Material Icons",
        "fillColor": "black"
      },
      "doAppendSelectStyle": false
    },

    {
      "type": "VECTOR",
      "lid": "earthquakes",
      "url": "./static/data/2012_Earthquakes_Mag5.kml",
      "formatConfig": {
        "extractStyles": false
      },
      "format": "KML",
      "visible": true,
      "selectable": true,
      "hoverable": true,
      "hoverAttribute": "name",
      "style": {
        "iconUrl": "./static/icon/circle.svg",
        "scale": 4,
        "anchor": [0.5, 37],
        "anchorXUnits": "fraction",
        "anchorYUnits": "pixels"
      },
      "selectStyle": {
        "radius": 10,
        "strokeColor": "gray",
        "strokeWidth": 5,
        "fillColor": "rgb(255, 255, 0, 0.2)"
      }
    },
    {
      "type": "TILEWMS",
      "lid": "ahocevar-wms",
      "format": "image/png",
      "layers": "topp:states",
      "url": "https://ahocevar.com/geoserver/wms",
      "transparent": true,
      "projection": "EPSG:3857",
      "attribution": "Kindly provided by @ahocevar",
      "isBaseLayer": false,
      "visible": false,
      "displayInLayerList": true,
      "legend": true,
      "opacityControl": true,
      "crossOrigin": "anonymous"
    },

    {
      "type": "TILEARCGIS",
      "lid": "test_arcgisrest",
      "format": "image/jpeg",
      "url": "https://cartografia.comune.padova.it/server/rest/services/topo/MapServer",
      "params": {
        "LAYERS":"show:3,16",
        "TRANSPARENT": true
      },
      "transparent": true,
      "projection": "EPSG:3003",
      "attribution": "Comune di padova",
      "isBaseLayer": false,
      "visible": false,
      "displayInLayerList": true,
      "legend": false,
      "opacityControl": true,
      "crossOrigin": "anonymous"
    },

    {
      "type": "IMAGEWMS",
      "lid": "ahocevar-imagewms",
      "ratio": 1.5,
      "format": "image/png",
      "layers": "ne:ne_10m_populated_places",
      "url": "https://ahocevar.com/geoserver/wms",
      "transparent": true,
      "projection": "EPSG:3857",
      "attribution": "Kindly provided by @ahocevar",
      "isBaseLayer": false,
      "visible": false,
      "displayInLayerList": true,
      "opacityControl": true,
      "crossOrigin": "anonymous"
    },
    {
      "type": "VECTORTILE",
      "lid": "ahocevar-vectortiles",
      "url": "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf",
      "format": "MVT",
      "attribution": "Kindly provided by @ahocevar",
      "visible": false,
      "opacityControl": true,
      "style": {
        "strokeColor": "gray",
        "strokeWidth": 1,
        "fillColor": "rgba(20,20,20,0.1)"
      }
    },

    {
      "type": "XYZ",
      "url": "https://tile.opentopomap.org/{z}/{x}/{y}.png",
      "lid": "opentopomap",
      "isBaseLayer": true,
      "visible": false,
      "crossOrigin": "anonymous"
    },

    {
      "type": "OSM",
      "lid": "osm-bg",
      "isBaseLayer": true,
      "visible": true,
      "crossOrigin": "anonymous"
    }

  ],

  "modules": {
    "wgu-layerlist": {
      "target": "menu",
      "win": "floating",
      "icon": "md:layers",
      "draggable": false
    },
    "wgu-measuretool": {
      "target": "menu",
      "win": "floating",
      "icon": "md:photo_size_select_small",
      "draggable": false,
      "strokeColor": "#c62828",
      "fillColor": "rgba(198,40,40,0.2)",
      "sketchStrokeColor": "rgba(198,40,40,0.8)",
      "sketchFillColor": "rgba(198,40,40,0.1)",
      "sketchVertexStrokeColor": "#c62828",
      "sketchVertexFillColor": "rgba(198,40,40,0.2)"
    },
    "wgu-infoclick": {
      "target": "menu",
      "win": "floating",
      "icon": "md:info",
      "draggable": false,
      "initPos": {
        "left": 8,
        "top": 74
      },
      "showMedia": false
    },
    "wgu-geocoder": {
      "target": "toolbar",
      "minChars": 2,
      "queryDelay": 200,
      "debug": false,
      "provider": "osm",
      "providerOptions": {
        "lang": "en-US",
        "countrycodes": "",
        "limit": 6
      }
    },
    "wgu-zoomtomaxextent": {
      "target": "toolbar"
    },
    "wgu-maprecorder": {
      "target": "toolbar",
      "win": "floating",
      "icon": "mdi-video",
      "draggable": false,
      "initPos": {
        "left": 8,
        "top": 230
      }
    },
    "wgu-helpwin": {
      "target": "toolbar",
      "win": "floating",
      "icon": "md:help"
    },
    "wgu-geolocator": {
      "target": "toolbar"
    },
    "wgu-themeswitcher": {
      "target": "toolbar",
      "icon": "md:dark_mode"
    },
    "wgu-attributetable": {
      "target": "menu",
      "win": "floating",
      "icon": "md:table_chart",
      "syncTableMapSelection": true
    },
    "wgu-localeswitcher": {
      "target": "toolbar"
    },
    "sample-module": {
      "target": "toolbar",
      "win": "floating",
      "icon": "md:star",
      "closable": false
    }
  }
}
```

More elaborate examples can be found in the app-starter directory.
* [app-conf-projected.json](https://github.com/wegue-oss/wegue/blob/master/app-starter/static/app-conf-projected.json) demonstrates custom Projections and Tilegrids.
* [app-conf-minimal.json](https://github.com/wegue-oss/wegue/blob/master/app-starter/static/app-conf-minimal.json) is a minimal setup for a Wegue application.
* [app-conf-sidebar.json](https://github.com/wegue-oss/wegue/blob/master/app-starter/static/app-conf-sidebar.json) is an example for displaying module content inside a sidebar.
