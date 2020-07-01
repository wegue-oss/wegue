# mapLayers

JSON configuration objects for Wegue map layers 

## General

The following properties can be applied to all map layer types

| Property           | Mandatory | Meaning | Example |
|--------------------|:---------:|---------|---------|
| type               | x | Indicator which layer type is configured |  |
| lid                | x | Unique identifier for the layer | `"lid": "my-super-wms-layer"`  |
| name               | x | Human readable name for the layer, used e.g. in the LayerList | `"name": "My super WMS"` |
| projection         |   | The projection of the layer. Has to be defined in `projectionDefs` if not `EPSG:4326` or `EPSG:3857`. if not set the projection of the map is used | `"projection": "EPSG:3857"` |
| isBaseLayer        |   | Boolean value, whether the layer should be a background layeror not | `"isBaseLayer": false` |
| visible            |   | Boolean value, whether the layer should be initially visible | `"visible": false` |
| displayInLayerList |   | Boolean value, whether the layer appear in the LayerList  | `"displayInLayerList": true` |
| attributions     |   | Text or HTML string to be displayed as source attribution in the map  | `"attributions": "<a href='https://www.pdok.nl' target='_blank'>PDOK</a> by Dutch Kadaster",` |


## OSM

| Property           | Mandatory | Meaning | Example |
|--------------------|:---------:|---------|---------|
| type               | x | Indicator that the layer is a OpenStreetMap tile server layer, always `OSM` here  | `"type": "OSM"` |

## VECTOR

| Property           | Mandatory | Meaning | Example |
|--------------------|:---------:|---------|---------|
| type               | x | Indicator that the layer is a vector layer, always `VECTOR` here  | `"type": "VECTOR"` |
| url                | x  | The URL to the vector data resource (file) | `"url": "./static/data/2012_Earthquakes_Mag5.kml"` |
| format             | x | The format of the data linked in `url` (either `KML` or `GeoJSON` ) | `"format": "KML"` |
| selectable         | x | Boolean value, whether the features of the layer can be selected by click in order to display the attributes in a window | `"selectable": true` |
| hoverable         | x | Boolean value, whether the features of the layer can be hovered in order to display an attribute (see `hoverAttribute`) in a tooltip  | `"hoverable": true` |
| style              | x | Object to define a rendering style for the features of the layer  |  |

## VECTORTILE

| Property           | Mandatory | Meaning | Example |
|--------------------|:---------:|---------|---------|
| type               | x | Indicator that the layer is a vector layer, always `VECTORTILE` here  | `"type": "VECTORTILE"` |
| url                | x  | The URL to the vector tile service | `"url": "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf"` |
| format             | x | The format of the data linked in `url` (either `MVT`, `TopoJSON` or `GeoJSON` ) | `"format": "MVT"` |
| style              | x | Object to define a rendering style for the features of the layer  |  |

## WMS

| Property           | Mandatory | Meaning | Example |
|--------------------|:---------:|---------|---------|
| type               | x | Indicator that the layer is a WMS, always `WMS` here  | `"type": "WMS"` |
| layers             | x | The WMS `LAYERS` parameter | `"layers": "topp:states"` |
| url                | x | The GetMap URL of the WMS | `"url": "https://ahocevar.com/geoserver/wms"` |
| format             |   | Image format for the WMS (has to be supported by the WMS) | `"format": "image/png"` |
| transparent        |   | Boolean value, whether the WMS layer should be queried with a transparent background  | `"transparent": true` |
| singleTile         |   | Boolean value, whether the WMS layer should be queried in single tile mode | `"singleTile": false` |
| tileGridRef        |   | Identifier of the tile grid to use for this layer (has to be defined in `tileGridDefs` | `"tileGridRef": "dutch_rd"` |

## XYZ

| Property           | Mandatory | Meaning | Example |
|--------------------|:---------:|---------|---------|
| type               | x | Indicator that the layer is a XYZ tiled image layer, always `XYZ` here  | `"type": "XYZ"` |
| url                | x | The URL of the service providing the image tiles | `"url": "https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart/EPSG:28992/{z}/{x}/{y}.png"` |
| tileGridRef        |   | Identifier of the tile grid to use for this layer (has to be defined in `tileGridDefs` | `"tileGridRef": "dutch_rd"` |