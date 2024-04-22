# mapLayers

JSON configuration objects for Wegue map layers

## General

The following properties can be applied to all map layer types

| Property           | Meaning | Example |
|--------------------|:---------:|---------|
| **type**           |  Indicator which layer type is configured |  |
| **lid**            |  Unique identifier for the layer | `"lid": "my-super-wms-layer"`  |
| name               |  Human readable name for the layer, used e.g. in the LayerList. This setting will override the layer name declared in the language packs. | `"name": "My super WMS"` |
| isBaseLayer        | Boolean value, whether the layer should be a background layer or not. Background layers will be available from the background layer selection button on the map. | `"isBaseLayer": false` |
| visible            | Boolean value, whether the layer should be initially visible. Defaults to `true`. | `"visible": false` |
| extent             | Array containing the bounding extent for layer rendering. The layer will not be rendered outside of this extent. Per default the extent of the layer is not constrained. | `"extent": [600584.4677702306, 5906357.431606389, 1864172.5237905537, 7388769.588491274]` |
| opacity            | Numeric value ranging from 0 to 1 describing the opaqueness of the layer. Defaults to `1.0`. | `"opacity": 0.5` |
| opacityControl     | Boolean value, whether a slider control to customize the layers opacity should appear in the LayerList. Defaults to `false`.  | `"opacityControl": true`|
| zIndex             | Numeric value specifying the stack order of layers. Layers will be ordered by z-index and then by order of declaration. Defaults to `-1` for background layers and `0` for all other layers.  | `"zIndex": 2` |
| displayInLayerList | Boolean value, whether the layer should appear in the LayerList. Ignored if the layer is a background layer - see option `isBaseLayer`  | `"displayInLayerList": true` |
| supportsPermalink  | Boolean value, whether the layers state should be considered in permanent links - see also [permalink](wegue-configuration?id=permalink). Defaults to `true`.  | `"supportsPermalink": true` |
| attributions       | Text or HTML string to be displayed as source attribution in the map. This setting will override the layer attributions declared in the language packs.  | `"attributions": "<a href='https://www.pdok.nl' target='_blank'>PDOK</a> by Dutch Kadaster",` |
| previewImage       | URL to a preview image for layers to be displayed in the background layer selection control. This option has no effect if the layer is not a background layer - see option `isBaseLayer`  | `"previewImage": "static/icon/my-layer-preview.png"`  |
| legend             | Boolean value, whether a layer legend image should be displayed in the LayerList. Defaults to `false`.  | `"legend": true`|
| legendUrl          | URL to a legend image. This value is required to produce a legend, if the layer is not a WMS layer. The URL may contain format placeholders corresponding to the parameters `language`, `scale` or any of the additional options given among `legendOptions`. A placeholder is delimited by `{{` and `}}` – i.e. `{{VAR_NAME}}`. | `"legendUrl": "static/icon/my-layer-legend-{{LANGUAGE}}.png"`
| legendOptions      | An object, containing additional parameters to request the legend image. Supported options may be vendor specific, e.g. see [GeoServer Docs](https://docs.geoserver.org/latest/en/user/services/wms/get_legend_graphic/index.html) for the options supported for WMS layers in GeoServer. | `"legendOptions": {"transparent": true, "width": 14 }`



## OSM

| Property           | Meaning | Example |
|--------------------|:---------:|---------|
| **type**           | Indicator that the layer is a OpenStreetMap tile server layer, always `OSM` here  | `"type": "OSM"` |
| crossOrigin        | Provides support for CORS, defining how the layers source handles crossorigin requests. For more information and the supported values see [HTML attribute: crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)  | `"crossOrigin": "anonymous"` |

## VECTOR

| Property            | Meaning | Example |
|---------------------|:---------:|---------|
| **type**            | Indicator that the layer is a vector layer, always `VECTOR` here  | `"type": "VECTOR"` |
| **url**             | The URL to the vector data resource (file) | `"url": "./static/data/2012_Earthquakes_Mag5.kml"` |
| **format**          | The format of the data linked in `url` (either `KML` or `GeoJSON` ) | `"format": "KML"` |
| selectable          | Boolean value, whether the features of the layer can be selected by click in order to display the attributes in a window | `"selectable": true` |
| style               | Object to define a rendering style for the features of the layer  | see [style](map-layer-configuration?id=style-for-vectorlayers) |
| selectStyle         | The style for a selected feature | see [style](map-layer-configuration?id=style-for-vectorlayers) |
| doAppendSelectStyle | If the selectStyle should be appended to the original style, defaults to `false` | `"doAppendSelectStyle": true` |
| columnMapping       | Maps the property names to human-readable text. Can be used by `AttributeTable`. | `"columnMapping": {"name": "Name", "email": "Email"}`
| hoverable           | Boolean value, whether the features of the layer can be hovered in order to display information in a tooltip. Wegue's default hover tooltip renders a single feature attribute which has to be declared by `hoverAttribute`. You can also choose to implement a custom overlay declared by `hoverOverlay` to render multiple feature attributes in a custom tooltip. | `"hoverable": true` |
| hoverAttribute      | Attribute to be shown if a feature of the layer is hovered. Only has an effect if `hoverable` is set to `true`.  | `"hoverAttribute": "name"` |
| hoverOverlay        | ID of a custom map overlay to display when a feature of the layer is hovered. Only has an effect if `hoverable` is set to `true`. For more information on how to implement a map overlay see the [reusable components](reusable-components?id=map-overlay) section. | `"hoverOverlay": "my-custom-overlay"` |

## WFS

| Property            |  Meaning  | Example |
|---------------------|:---------:|---------|
| **type**            | Indicator that the layer is a WFS-based vector layer, always `WFS` here  | `"type": "WFS"` |
| **url**             | The URL to the Web Feature Service (WFS) | `"url": "https://ows.terrestris.de/geoserver/osm/wfs"` |
| **typeName**        | The name of the FeatureType | `"typeName": "osm:osm-fuel"`|
| projection         |  The projection of the layer. Has to be defined in `projectionDefs` if not `EPSG:4326` or `EPSG:3857`. if not set the projection of the map is used | `"projection": "EPSG:3857"` |
| style               | Object to define a rendering style for the features of the layer  | see [style](map-layer-configuration?id=style-for-vectorlayers) |
| version             | The version of the WFS, defaults to `1.1.0` | `"version": "2.0.0"`|
| maxFeatures         | Limits the amount of features that are queried and displayed | `"maxFeatures": 50`|
| format              | The format that should be used. Possible values are `GeoJSON`, `GML2`, `GML3` and `GML32`. Defaults to `GML3` |  `"format": "GeoJSON"`|
| selectable          | Boolean value, whether the features of the layer can be selected by click in order to display the attributes in a window | `"selectable": true` |
| selectStyle         | The style for a selected feature | see [style](map-layer-configuration?id=style-for-vectorlayers) |
| doAppendSelectStyle | If the selectStyle should be appended to the original style, defaults to `false` | `"doAppendSelectStyle": true` |
| columnMapping       | Maps the property names to human-readable text. Can be used by `AttributeTable`. | `"columnMapping": {"name": "Name", "email": "Email"}`
| hoverable           | Boolean value, whether the features of the layer can be hovered in order to display information in a tooltip. Wegue's default hover tooltip renders a single feature attribute which has to be declared by `hoverAttribute`. You can also choose to implement a custom overlay declared by `hoverOverlay` to render multiple feature attributes in a custom tooltip. | `"hoverable": true` |
| hoverAttribute      | Attribute to be shown if a feature of the layer is hovered. Only has an effect if `hoverable` is set to `true`.  | `"hoverAttribute": "name"` |
| hoverOverlay        | ID of a custom map overlay to display when a feature of the layer is hovered. Only has an effect if `hoverable` is set to `true`. For more information on how to implement a map overlay see the [reusable components](reusable-components?id=map-overlay) section. | `"hoverOverlay": "my-custom-overlay"` |


## VECTORTILE

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **type**           | Indicator that the layer is a vector layer, always `VECTORTILE` here  | `"type": "VECTORTILE"` |
| **url**            | The URL to the vector tile service | `"url": "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf"` |
| **format**         | The format of the data linked in `url` (either `MVT`, `TopoJSON` or `GeoJSON` ) | `"format": "MVT"` |
| projection         |  The projection of the layer. Has to be defined in `projectionDefs` if not `EPSG:4326` or `EPSG:3857`. if not set the projection of the map is used | `"projection": "EPSG:3857"` |
| style              | Object to define a rendering style for the features of the layer  | see [style](map-layer-configuration?id=style-for-vectorlayers) |
| hoverable           | Boolean value, whether the features of the layer can be hovered in order to display information in a tooltip. Wegue's default hover tooltip renders a single feature attribute which has to be declared by `hoverAttribute`. You can also choose to implement a custom overlay declared by `hoverOverlay` to render multiple feature attributes in a custom tooltip. | `"hoverable": true` |
| hoverAttribute      | Attribute to be shown if a feature of the layer is hovered. Only has an effect if `hoverable` is set to `true`.  | `"hoverAttribute": "name"` |
| hoverOverlay        | ID of a custom map overlay to display when a feature of the layer is hovered. Only has an effect if `hoverable` is set to `true`. For more information on how to implement a map overlay see the [reusable components](reusable-components?id=map-overlay) section. | `"hoverOverlay": "my-custom-overlay"` |

## WMS (tiled)

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **type**           | Indicator that the layer is a WMS, use `TILEWMS` or `WMS` (deprecated)  | `"type": "TILEWMS"` |
| **layers**         | The WMS `LAYERS` parameter | `"layers": "topp:states"` |
| **url**            | The GetMap URL of the WMS | `"url": "https://ahocevar.com/geoserver/wms"` |
| projection         |  The projection of the layer. Has to be defined in `projectionDefs` if not `EPSG:4326` or `EPSG:3857`. if not set the projection of the map is used | `"projection": "EPSG:3857"` |
| format             | Image format for the WMS (has to be supported by the WMS) | `"format": "image/png"` |
| transparent        | Boolean value, whether the WMS layer should be queried with a transparent background  | `"transparent": true` |
| tileGridRef        | Identifier of the tile grid to use for this layer (has to be defined in `tileGridDefs`) | `"tileGridRef": "dutch_rd"` |
| crossOrigin        | Provides support for CORS, defining how the layers source handles crossorigin requests. For more information and the supported values see [HTML attribute: crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)  | `"crossOrigin": "anonymous"` |
| hoverable           | Boolean value, whether the features of the layer can be hovered in order to display information in a tooltip. The WMS must support `GetFeatureInfo` requests to obtain feature information. Wegue's default hover tooltip renders a single feature attribute which has to be declared by `hoverAttribute`. You can also choose to implement a custom overlay declared by `hoverOverlay` to render multiple feature attributes in a custom tooltip. | `"hoverable": true` |
| hoverAttribute      | Attribute to be shown if a feature of the layer is hovered. Only has an effect if `hoverable` is set to `true`.  | `"hoverAttribute": "name"` |
| hoverOverlay        | ID of a custom map overlay to display when a feature of the layer is hovered. Only has an effect if `hoverable` is set to `true`. For more information on how to implement a map overlay see the [reusable components](reusable-components?id=map-overlay) section. | `"hoverOverlay": "my-custom-overlay"` |
| params        | This allows to inject custom HTTP parameters to the GetMap request of the layer. | `"params": {"FEATUREID": 1}"` |

## Arcgis REST (tiled)

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **type**           | Indicator that the layer is `"TILEARCGIS"`  | `"type": "TILEARCGIS"` |
| **url**            | The GetMap URL of the WMS | `"url": "https://cartografia.comune.padova.it/server/rest/services/topo/MapServer"` |
| projection         |  The projection of the layer. Has to be defined in `projectionDefs` if not `EPSG:4326` or `EPSG:3857`. if not set the projection of the map is used | `"projection": "EPSG:3857"` |
| tileGrid        |  	Identifier of the tile grid to use for this layer (has to be defined in `tileGridDefs`) | `"tileGridRef": "dutch_rd"` |
| crossOrigin        | Provides support for CORS, defining how the layers source handles crossorigin requests. For more information and the supported values see [HTML attribute: crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)  | `"crossOrigin": "anonymous"` |
| params         | ArcGIS Rest parameters. This field is optional. Service defaults will be used for any fields not specified. FORMAT is PNG32 by default. F is IMAGE by default. TRANSPARENT is true by default. BBOX, SIZE, BBOXSR, and IMAGESR will be set dynamically. Set LAYERS to override the default service layer visibility. See https://developers.arcgis.com/rest/services-reference/export-map.htm for further reference. | `params:{"LAYERS": show:1,4,5,6, "TRASPARENT": true}` |

## WMS (image)

Similar properties as Tiled WMS, with these exceptions:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **type**           | Indicator that the layer is a Image WMS, always `IMAGEWMS`  | `"type": "IMAGEWMS"` |
| ratio              | Ratio 1 means image requests are the size of the map viewport, 2 means twice the width and height of the map viewport. Must be 1 or higher. | `"ratio": 1.5` |
| interpolate        | By default, linear interpolation is used when resampling. Set to false to use the nearest neighbor instead. | `"interpolate": false` |
| tileGridRef        | Parameter is not used for `IMAGEWMS` | |


## XYZ

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **type**           | Indicator that the layer is a XYZ tiled image layer, always `XYZ` here  | `"type": "XYZ"` |
| **url**            | The URL of the service providing the image tiles | `"url": "https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart/EPSG:28992/{z}/{x}/{y}.png"` |
| projection         |  The projection of the layer. Has to be defined in `projectionDefs` if not `EPSG:4326` or `EPSG:3857`. if not set the projection of the map is used | `"projection": "EPSG:3857"` |
| tileGridRef        | Identifier of the tile grid to use for this layer (has to be defined in `tileGridDefs` | `"tileGridRef": "dutch_rd"` |
| crossOrigin        | Provides support for CORS, defining how the layers source handles crossorigin requests. For more information and the supported values see [HTML attribute: crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)  | `"crossOrigin": "anonymous"` |

## Style for Vectorlayers

Mandatory properties:
- Points require **`radius`** and/or **`iconUrl`** and/or **`textIcon`**.
- Polygons require **`fillColor`**.
- Lines require **`strokeColor`** or **`strokeWidth`**.

| Property           | Meaning | Example |
|--------------------|:-------:|---------|
| strokeColor        | see [color](https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke-Stroke.html) | `"strokeColor": "purple"` |
| strokeWidth        | see [width](https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke-Stroke.html) | `"strokeWidth": 2` |
| fillColor          | Point and Polygon, see [color](https://openlayers.org/en/latest/apidoc/module-ol_style_Fill-Fill.html) | `"fillColor": "rgba(155,153,51,0.5)"` |
| label              | see [label](map-layer-configuration?id=label) | see [label](map-layer-configuration?id=label) |
| radius             | see [radius](https://openlayers.org/en/latest/apidoc/module-ol_style_Circle-CircleStyle.html) | `"radius": 4` |
| scale              | Point only, see [scale](https://openlayers.org/en/latest/apidoc/module-ol_style_Icon-Icon.html) | `"scale": 4` |
| iconUrl            | Point only, see [src](https://openlayers.org/en/latest/apidoc/module-ol_style_Icon-Icon.html) | `"iconUrl": "./static/icon/circle.svg"` |
| iconAnchor         | Point only, see [anchor](https://openlayers.org/en/latest/apidoc/module-ol_style_Icon-Icon.html) | `"anchor": [0.5, 37]` |
| iconAnchorXUnits   | Point only, see [anchorXUnits](https://openlayers.org/en/latest/apidoc/module-ol_style_Icon-Icon.html) | `"anchorXUnits": "fraction"` |
| iconAnchorYUnits   | Point only, see [anchorYUnits](https://openlayers.org/en/latest/apidoc/module-ol_style_Icon-Icon.html) | `"anchorYUnits": "pixels"` |
| textIcon           | Point only, see [text](https://openlayers.org/en/latest/apidoc/module-ol_style_Text-Text.html). Icons for font `normal 30px Material Icons` can be found [here](https://fonts.google.com/icons?selected=Material+Icons) | `"textIcon": "local_gas_station"` |
| font               | Point only, see [font](https://openlayers.org/en/latest/apidoc/module-ol_style_Text-Text.html) | `"font": "normal 30px Material Icons"` |

#### Label

| Property           |  Meaning | Example |
|--------------------|:---------:|---------|
| **attribute**      | the attribute of the layer to display | `"attribute": "name"` |
| minResolution      | the minimal map resolution to show the label | `"minResolution": 4.0` |
| maxResolution      | the maximal map resolution to show the label | `"maxResolution": 100.0` |
| outlineColor       | see [color](https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke-Stroke.html) | `"outlineColor": "white"` |
| outlineWidth       | see [width](https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke-Stroke.html) | `"outlineWidth": 2` |
| fillColor          | see [color](https://openlayers.org/en/latest/apidoc/module-ol_style_Fill-Fill.html) | `"fillColor": "black"` |

Additionally every configuration property of [`ol/style/Text`](https://openlayers.org/en/latest/apidoc/module-ol_style_Text-Text.html) can be used.

#### Example

```json
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
  }
}

```
