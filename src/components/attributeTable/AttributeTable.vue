<template>
  <!--
  mobile-breakpoint="0" prevents the table to
  switch to a mobile optimized list on small devices
  -->
  <v-data-table
    dense
    :loading="loading"
    :loading-text="loadingText"
    :headers="headers"
    :items="records"
    mobile-breakpoint="0"
    :page.sync="page"
    :footer-props="{
        'items-per-page-options': [],
        'show-first-last-page': true
      }"
  ></v-data-table>
</template>

<script>
import { Mapable } from '../../mixins/Mapable';
import LayerUtil from '../../util/Layer';

export default {
  name: 'wgu-attributetable',
  mixins: [Mapable],
  props: {
    layerId: {type: String, required: false, default: null},
    loadingText: {type: String, required: false, default: 'Loading... Please wait'},
    /** A list of column names that should not be displayed. */
    forbiddenColumnNames: {
      type: Array,
      required: false,
      default: function () {
        return ['geometry', 'the_geom']
      }
    }
  },
  data () {
    return {
      headers: [],
      records: [],
      layer: null,
      source: null,
      loading: true,
      page: 1
    }
  },
  created () {
    this.populateTable()
  },
  watch: {
    layerId () {
      this.populateTable()
    }
  },
  methods: {
    /**
     * Load features from layer and display it in
     * in the table.
     */
    populateTable () {
      if (!this.map || !this.layerId) {
        return;
      }
      this.loading = true;

      // reset table properties
      this.records = [];
      this.headers = [];
      this.page = 1;

      this.layer = LayerUtil.getLayerByLid(this.layerId, this.map);
      this.source = this.layer.getSource();

      const features = this.source.getFeatures();

      // features can only be loaded if layer is visible
      // https://github.com/openlayers/openlayers/blob/main/doc/faq.md#why-arent-there-any-features-in-my-source
      if (features.length) {
        this.applyRecordsFromOlLayer();
        this.applyColumnMapping();
        this.loading = false;
      } else {
        this.source.on('change', (evt) => {
          const source = evt.target;
          if (source.getState() === 'ready') {
            this.applyRecordsFromOlLayer();
            this.applyColumnMapping();
            this.loading = false;
          }
        });
        this.layer.setVisible(true);
      }
    },
    /**
     * Read features from layer source
     * and store it in component.
     */
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
        for (const [propertyName, displayName] of Object.entries(this.layer.get('columnMapping'))) {
          headers.push({
            text: displayName,
            value: propertyName
          });
        }
      } else {
        // TODO: taking the first feature assumes that all features
        //       have the same structure
        let keys = this.source.getFeatures()[0].getKeys();
        // remove keys that contain a geometry
        const filtered = keys.filter(
          key => (!this.forbiddenColumnNames.includes(key))
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
