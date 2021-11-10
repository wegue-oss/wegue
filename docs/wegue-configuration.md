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
| **modules**        | Array of module configuration objects | See [modules](module-configuration) |
| **mapLayers**      | Array of map layer configuration objects | See [mapLayers](map-layer-configuration) |
| projectionDefs     | Array of CRS / projection definition objects compatible to proj4js | See [projectionDefs](wegue-configuration?id=projectiondefs) |
| tileGridDefs       | Array of tile grid definition objects | See [tileGridDefs](wegue-configuration?id=tilegriddefs) |
| viewAnimation      | Configuration object for view animations | See [viewAnimation](wegue-configuration?id=viewAnimation) |
| sidebar            | Configuration object for the application sidebar. | See [sidebar](wegue-configuration?id=sidebar) |

### colorTheme

Wegue supports the Vuetify (light and dark) theme configuration out of the box. This property expects a json object with the same format described in the [vuetify documentation](https://vuetifyjs.com/en/features/theme/#customizing).

Example:
```json
"colorTheme": {
  "dark": false, // Start with dark theme on
  "themes": {    // Configuration for themes
    "light": {   // Light theme configuration
      "primary": "#af2622",
      "onprimary": "#ffffff",
      "secondary": "#ec483b",
      "onsecondary": "#ffffff",
      "accent": "#ffffff",
      "error": "#ff6f00"
    },
    "dark": {    // Dark theme configuration
      "primary": "#272727",
      "onprimary": "#ffffff",
      "secondary": "#ea9b9b",
      "onsecondary": "#272727",
      "accent": "#ea9b9b",
      "error": "#ff6f00"
    }
  }
},
```

Each theme configuration contains the following classes of colors:

| Color         | Description         | Example       |
| ------------- |:-------------------:| ------------- |
| primary       | color for main UI components             | Header, Footer |
| secondary     | color to accent selected parts of the UI | Floating buttons, selection controls, progress bars |
| accent        | accent selected parts of the UI          | Mainly used to accent components in dark mode  |
| error         | semantic color for errors                | Used in components that display error messages  |


In addition, Wegue also supports the following "on" colors:

| Color         | Description         | Example       |
| ------------- |:-------------------:| ------------- |
| onprimary     | color over primary color   | typography/icons over primary color |
| onsecondary   | color over secondary color | typography/icons over secondary color |

To simplify the theming configuration, if the "themes" property isn't configured, Wegue will fallback to the default colors in the example above. Otherwise, both the "light" and "dark" themes will be built based on the respective configured colors. The following tables specify which colors are mandatory and their respective default values.

#### Light theme:
| Color         | Mandatory | Default             |
| ------------- |:---------:|:-------------------:|
| primary       | yes |       - |
| secondary     |  no | primary |
| accent        |  no | primary |
| error         |  no | #FF5252 |
| onprimary     |  no | white if primary is a dark color. <br/> black if primary is a light color |
| onsecondary   |  no | white if secondary is a dark color. <br/> black if secondary is a light color |

#### Dark theme:
| Color         | Mandatory | Default             |
| ------------- |:---------:|:-------------------:|
| primary       |   - |   #272727 |
| secondary     | yes |         - |
| accent        |  no | secondary |
| error         |  no |   #FF5252 |
| onprimary     |  no | white if primary is a dark color. <br/> black if primary is a light color |
| onsecondary   |  no | white if secondary is a dark color. <br/> black if secondary is a light color |

Note that there is a clear asymmetry in the "light" and "dark" theme configuration. In the "light" theme, the primary color is mandatory and all the 
others are derived from that. In the "dark" theme, the predominant color must be a shade of black (to comply with the [material design specification](https://material.io/design/color/dark-theme.html)), so the primary color is locked to `#272727`. Therefore, in this case the colors are derived from the second predominant color.

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
      "name": "WMTS - Topo Basemap - PDOK",
      "url": "https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart/EPSG:28992/{z}/{x}/{y}.png",
      "projection": "EPSG:28992",
      "tileGridRef": "dutch_rd",
      "visible": true
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
| color              | Background color of the sidebar. Defaults to white. | `"color": "white"` |
| width              | Width of the sidebar in pixels. Defaults to 400px.  | `"width": 400` |
| visible            | Specifies whether the sidebar appears in open or closed state on application start. Defaults to true. | `"visible": true` |
| autoScroll         | Whether to automatically scroll the sidebar to the active module. Defaults to true. | `"autoScroll": true` |
| scrollDuration     | Animation duration in milliseconds to automatically scroll the sidebar to the active module. Defaults to 500ms. | `"scrollDuration": 500` |

Below is an example for a sidebar configuration object:

```
  "sidebar": {
    "visible": true,
    "width": 400,
    "color": "white",
    "autoScroll": true,
    "scrollDuration": 500
  }
```

## Example configuration

Example configurations can be found in the `app-starter/static` directory. Below an example as used in the Demo:

```json
{

  "colorTheme": {
    "dark": false,
  },

  "logo": "https://dummyimage.com/100x100/aaa/fff&text=Wegue",
  "logoWidth": "100",
  "logoHeight": "100",

  "showCopyrightYear": true,

  "lang": {
    "supported": {
      "en": "English",
      "de": "Deutsch"
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
      "type": "WMS",
      "lid": "ahocevar-wms",
      "format": "image/png",
      "layers": "topp:states",
      "url": "https://ahocevar.com/geoserver/wms",
      "transparent": true,
      "singleTile": false,
      "projection": "EPSG:3857",
      "attribution": "",
      "isBaseLayer": false,
      "visible": false,
      "displayInLayerList": true
    },

    {
      "type": "VECTORTILE",
      "lid": "ahocevar-vectortyle",
      "url": "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf",
      "format": "MVT",
      "visible": false,
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
      "icon": "layers",
      "draggable": false
    },
    "wgu-measuretool": {
      "target": "menu",
      "win": "floating",
      "icon": "photo_size_select_small",
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
      "icon": "info",
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
      "icon": "help"
    },
    "wgu-geolocator": {
      "target": "toolbar"
    },
    "wgu-attributetable": {
      "target": "menu",
      "win": "floating",
      "icon": "table_chart",
      "syncTableMapSelection": true
    },
    "wgu-localeswitcher": {
      "target": "toolbar"
    }
  }
}
```

More elaborate examples can be found in the app-starter directory.
* [app-conf-projected.json](https://github.com/meggsimum/wegue/blob/master/app-starter/static/app-conf-projected.json) demonstrates custom Projections and Tilegrids.
* [app-conf-minimal.json](https://github.com/meggsimum/wegue/blob/master/app-starter/static/app-conf-minimal.json) is a minimal setup for a Wegue application.
* [app-conf-sidebar.json](https://github.com/meggsimum/wegue/blob/master/app-starter/static/app-conf-sidebar.json) is an example for displaying module content inside a sidebar.
