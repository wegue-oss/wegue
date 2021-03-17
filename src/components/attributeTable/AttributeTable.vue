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
  props: {
    layerId: {type: String, required: false, default: null}
  },
  data () {
    return {
      headers: [],
      records: [],
      layer: null,
      source: null
    }
  },
  created () {
    this.populatedTable()
  },
  watch: {
    layerId () {
      this.populatedTable()
    }
  },
  methods: {
    populatedTable () {
      if (!this.map || !this.layerId) {
        console.log('return');
        return;
      }

      // empty table in case, loading takes longer
      this.records = [];
      this.headers = [];

      // TODO: show waiting symbol

      this.layer = LayerUtil.getLayerByLid(this.layerId, this.map);
      this.source = this.layer.getSource();

      const features = this.source.getFeatures();

      // features can only be loaded if layer is visible
      // https://github.com/openlayers/openlayers/blob/main/doc/faq.md#why-arent-there-any-features-in-my-source
      if (features.length) {
        this.applyRecordsFromOlLayer();
        this.applyColumnMapping();
      } else {
        this.source.on('change', (evt) => {
          const source = evt.target;
          if (source.getState() === 'ready') {
            this.applyRecordsFromOlLayer();
            this.applyColumnMapping();
          }
        });
        this.layer.setVisible(true);
      }
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

        // TODO: this only works for the case that
        //       the geometry is named 'geometry'
        //       --> it might be better to check if the
        //           type of the property is valid for the table
        const filtered = keys.filter(
          key => ((key !== 'geometry') && (key !== 'the_geom'))
        );
        filtered.forEach(propertyName => {
          headers.push({
            text: propertyName,
            value: propertyName
          });
        });
      }
      this.headers = headers;
    }
  }
}
</script>
