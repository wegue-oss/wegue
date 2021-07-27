# Language packs

Wegue comes with multi language support via the [Vue I18n is internationalization plugin](https://vue-i18n.intlify.dev/). Locale specific messages are organized in language files, which are modelled as JSON documents. An example can be found in the `app-starter\locale` folder. After initializing the application, a template for language customization can be found in the `app/locales` folder.

This document lists the most frequently customized messages, for a comprehensive lists of all available definitions please have a look at the language packs of the Wegue core  in the `src/locales` folder. In general any message defined by the Wegue core application can be overridden from the application by declaring the same key path in your language packs in the `app/locales` folder.

For general information on message formatting syntax please refer to the [documentation of Vue I18n](https://vue-i18n.intlify.dev/guide/essentials/syntax).

## Application wide messages

Key: `app`

The following app wide messages can be customized:

| Property           | Meaning | Example |
|--------------------|:---------:|---------|
| title              | Title shown in the top toolbar of the application | `"title": "A Wegue WebGIS App"` |
| browserTitle       | HTML document title that is shown in the browser title bar or a browser page tab | `"browserTitle": "Wegue Demo App"` |
| footerTextLeft     | Text or HTML string to be displayed in the left side of the toolbar | `"footerTextLeft": "Powered by <a href='https://meggsimum.de/wegue/' target='_blank'>Wegue WebGIS</a>"` |
| footerTextRight    | Text or HTML string to be displayed in the right side of the toolbar | `"footerTextRight": "meggsimum"` |
| logo    | Alternate application logo text. | `"logo": "App Logo"` |

## Layer names

Key: `mapLayers`

Customize display names for layers configured in the [mapLayers](map-layer-configuration) section of your application configuration. For each layer a key matching the `lid` of your layer should be declared. The value assigned to this key is an object supporting the following properties.

| Property           | Meaning | Example |
|--------------------|:---------:|---------|
| **name**           |  Human readable name for the layer, used e.g. in the LayerList | `"name": "My super WMS"` |

## Module specific messages

### General

Application modules can be localized by declaring a key matching the module identifier described in the [Module Configuration](module-configuration.md). The value contains and object holding the dedicated module messages. For example:

```json
  "wgu-layerlist": {
    "title": "My layer list",
  }
```

The following properties can be applied to all module types:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| title              | Override the default module title. | `"title": "my module title"` |

### GeoCoder

Key: `wgu-geocoder`

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| placeHolder        | Place holder text for the textfield | `"placeHolder": "Search address"` |

### HelpWindow

Key: `wgu-helpwin`

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| textTitle          |  The title over the text of the window         |   "About Wegue"      |
| htmlContent        |   The text content of the window. HTML can be used.        |   "<b>WebGIS with OpenLayers and Vue.js</b> Template and re-usable components for webmapping applications with OpenLayers and Vue.js"      |
| infoLinkText       |  The name of the link        |   "More Info"       |
| infoLinkUrl        |  The URL of the link         |   "http://wegue.org/"       |

### InfoClick

Key: `wgu-infoclick`

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| mediaInfoLinkText    |  Text shown in the link offering more information   |  "More Info ..."       |

### AttributeTable

Key: `wgu-attributetable`

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| selectorLabel      | Override the placeholder text for the layer selection combo box.  | `"selectorLabel": "Choose a layer"` |


## Example configuration

Below is an example configuration for an English language pack.

```json
{
  "app": {
    "title": "Vue.js / OpenLayers WebGIS",
    "browserTitle": "Wegue Demo App",
    "footerTextLeft": "Powered by <a href='https://meggsimum.de/wegue/' target='_blank'>Wegue WebGIS</a>",
    "footerTextRight": "meggsimum",
    "logo": "App Logo"
  },

  "mapLayers": {
    "wgu-drag-drop-layer" : {
      "name": "Uploaded Data"
    },
    "Shops": {
      "name": "Shops DaSchau"
    },
    "gas-wfs": {
      "name": "Gas Stations WFS"
    },
    "earthquakes": {
      "name": "Earthquakes 2012 (Mag 5)"
    },
    "ahocevar-wms": {
      "name": "WMS (ahocevar)"
    },
    "ahocevar-vectortyle": {
      "name": "Vector Tile Layer"
    },
    "opentopomap": {
      "name": "Open Topo Map"
    },
    "osm-bg": {
      "name": "Open Street Map"
    },
    "dutch-nat-parks" : {
      "name": "WFS (Dutch National Parks PDOK)"
    },
    "pdok-natura2000-wms" : {
      "name": "WMS - Natura 2000 Areas - PDOK"
    },
    "pdok-lufo-wms" : {
      "name": "WMS - Dutch Arial Map - PDOK"
    },
    "brtachtergrondkaart" : {
      "name": "WMTS - Topo Basemap - PDOK"
    },
    "terrestris-osm-wms" : {
      "name": "OSM WMS"
    }
  },

  "wgu-helpwin": {
    "title": "About",
    "textTitle": "About Wegue",
    "htmlContent": "<b>WebGIS with OpenLayers and Vue.js</b> Template and re-usable components for webmapping applications with OpenLayers and Vue.js",
    "infoLinkUrl": "http://wegue.org/",
    "infoLinkText": "More info"
  }
}
```



