<template>
    <v-data-table
      dense
      :headers="headers"
      :items="records"
    ></v-data-table>
</template>

<script>
import { Mapable } from '../../mixins/Mapable';
import LayerUtil from '../../util/Layer';

export default {
  name: 'wgu-attributetable',
  mixins: [Mapable],
  methods: {
    onMapBound () {
      this.layer = LayerUtil.getLayerByLid(this.layerId, this.map);
      this.source = this.layer.getSource();

      this.applyRecordsFromLayer();
      this.applyColumnMapping();
    },

    applyRecordsFromLayer () {
      this.records = this.source.getFeatures().map(
        feature => feature.getProperties()
      );
    },
    applyColumnMapping () {
      let headers = [];
      if (this.columnMapping) {
        for (const [propertyName, DisplayName] of Object.entries(this.columnMapping)) {
          headers.push({
            text: DisplayName,
            value: propertyName
          });
        }
      } else {
        // TODO: taking the first feature assumes that all features
        //       have the same structure
        let keys = this.source.getFeatures()[0].getKeys();

        // TODO: this only works for the case that
        //       the geometry is named 'geometry'
        //       --> it might be better to check if the
        //           type of the property is valid for the table
        const filtered = keys.filter(
          key => key !== 'geometry'
        );
        let headers = [];
        filtered.forEach(propertyName => {
          headers.push({
            text: propertyName,
            value: propertyName
          });
        });
      }
      this.headers = headers;
    }
  },
  props: {
    layerId: {type: String, required: true},
    columnMapping: {type: Object, required: false, default: null}
  },
  data () {
    return {
      headers: [
        {
          text: 'Ort',
          value: 'NAME'
        },
        {
          text: 'Einwohner (Max)',
          value: 'POP_MAX'
        }
      ],
      records: [],
      layer: null,
      source: null
    }
  }
}
</script>
