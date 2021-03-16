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
      // TODO: only show layer if features can be loaded
      this.layer = LayerUtil.getLayerByLid(this.layerId, this.map);
      this.source = this.layer.getSource();

      this.applyRecordsFromOlLayer();
      this.applyColumnMapping();
    },

    applyRecordsFromOlLayer () {
      if (!this.source) {
        return;
      }
      this.records = this.source.getFeatures().map(
        feature => feature.getProperties()
      );
    },

    /**
     * Read column mapping from layer property.
     * Otherwise we retrieve it from the feature
     * properties names.
     */
    applyColumnMapping () {
      if (!this.source ||
          !this.source.getFeatures() ||
          !this.source.getFeatures()[0]
      ) {
        return;
      }

      let headers = [];
      if (this.layer.get('columnMapping')) {
        for (const [propertyName, DisplayName] of Object.entries(this.layer.get('columnMapping'))) {
          headers.push({
            text: DisplayName,
            value: propertyName
          });
        }
      } else {
        // TODO: taking the first feature assumes that all features
        //       have the same structure
        let keys = this.source.getFeatures()[0].getKeys();
        console.log(keys);

        // TODO: this only works for the case that
        //       the geometry is named 'geometry'
        //       --> it might be better to check if the
        //           type of the property is valid for the table
        const filtered = keys.filter(
          key => key !== 'geometry'
        );
        console.log(filtered);
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
    layerId: {type: String, required: true}
  },
  data () {
    return {
      headers: [],
      records: [],
      layer: null,
      source: null
    }
  }
}
</script>
