<template>
  <!--
  mobile-breakpoint="0" prevents the table to
  switch to a mobile optimized list on small devices
  -->
  <v-data-table
    dense
    :loading="loading"
    :loading-text="$t('wgu-attributetable.loadingText')"
    :headers="headers"
    :items="records"
    mobile-breakpoint="0"
    :page.sync="page"
    :footer-props="{
        'items-per-page-options': [],
        'show-first-last-page': true
      }"
    @click:row="onRowClick"
    single-select
    :value="selectedRow"
    :item-key="uniqueRecordKeyName"
    :items-per-page="rowsPerPage"
    :height="getTableHeight()"
  ></v-data-table>
</template>

<script>
import { Mapable } from '../../mixins/Mapable';
import LayerUtil from '../../util/Layer';
import { WguEventBus } from '../../WguEventBus';
import MapInteractionUtil from '../../util/MapInteraction';
import ViewAnimationUtil from '../../util/ViewAnimation';

export default {
  name: 'wgu-attributetable',
  mixins: [Mapable],
  props: {
    /** The ID of the vector layer to display */
    layerId: { type: String, required: false, default: null },

    /** The name of the unique feature identifier */
    uniqueRecordKeyName: { type: String, required: false, default: 'fid' },

    /**
     * How many rows a page of the table should have.
     * Should be manually adjusted with tableHeight.
     */
    rowsPerPage: { type: Number, required: false, default: 10 },

    /**
     * The height of the table in pixel.
     * Should be manually adjusted with rowsPerPage.
     */
    tableHeight: { type: Number, required: false, default: 272 },

    /** If map and table should be synced */
    syncTableMapSelection: { type: Boolean, required: false, default: true },

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
      features: [],
      selectedRow: [],
      layer: null,
      loading: true,
      page: 1
    }
  },
  created () {
    this.populateTable()

    if (this.syncTableMapSelection) {
      this.activateSelectRowOnMapClick();
    }
  },
  beforeDestroy () {
    if (this.layer && this.layer.getSource()) {
      // unregister event after table is closed
      this.layer.getSource().un('change', this.prepareTableDataAndColumns);
    }
  },
  watch: {
    layerId () {
      this.populateTable()
    },
    features () {
      this.records = this.features.map(
        feature => {
          const record = feature.getProperties();
          // set feature id
          record[this.uniqueRecordKeyName] = feature.getId()
          return record;
        }
      );
    },
    records () {
      // set loading status depending if records are available
      if (this.records.length === 0) {
        this.loading = true;
      } else {
        this.loading = false;
        this.highlightInitialFeatureSelectionInTable();
      }
    }
  },
  methods: {
    /**
     * Highlight row when feature is already selected
     * before table is opened.
     */
    highlightInitialFeatureSelectionInTable () {
      const correspondingInteraction = MapInteractionUtil.getSelectInteraction(this.map, this.layerId);

      if (!correspondingInteraction) {
        return;
      }

      let features = correspondingInteraction.getFeatures();
      if (!features || features.getLength() !== 1) {
        return;
      }

      const feature = features.getArray()[0];
      if (!feature) {
        return;
      }

      const fid = feature.getId();
      if (!fid) {
        return;
      }
      this.highlightRowFromSelectedFeature(fid);
    },

    /**
     * Set the table height depending on desktop
     * or mobile view.
     *
     * @returns {int} The height of the table.
     */
    getTableHeight () {
      if (this.$vuetify.breakpoint.xs) {
        // we do not want to set this property
        return undefined;
      } else {
        return this.tableHeight;
      }
    },

    /**
     * Activate behaviour that a selected feature on the
     * map will be selected in the AttributeTable as well.
     */
    activateSelectRowOnMapClick () {
      WguEventBus.$on('map-selectionchange',
        (lid, featureArray) => {
          if (lid !== this.layerId || featureArray.length !== 1) {
            return;
          }
          const fid = featureArray[0].getId();
          this.highlightRowFromSelectedFeature(fid);
        });
    },

    /**
     * Highlight row matching the feature ID
     * and set correct page of the table.
     *
     * @param {Number} fid The ID of the selected feature.
     */
    highlightRowFromSelectedFeature (fid) {
      if (!fid) {
        return;
      }
      const foundRecord = this.records.find(record => record.fid === fid);
      if (!foundRecord) {
        return;
      }
      this.selectedRow = [foundRecord];

      const recIndex = this.records.indexOf(foundRecord);
      if (!recIndex) {
        return;
      }
      this.$nextTick(() => {
        // calculate page and set it
        this.page = Math.ceil((recIndex + 1) / this.rowsPerPage);
      })
    },

    /**
     * Handler for click on a row.
     *
     * It zooms to the clicked features.
     *
     * If the layer is 'selectable', the corresponding feature on the
     * map will be styled as selected.
     */
    onRowClick (record) {
      if (!this.syncTableMapSelection) {
        return;
      }

      const fid = record[this.uniqueRecordKeyName];
      if (!fid) {
        return;
      }

      this.selectedRow = [record];

      const foundFeature = this.features.find(feature => feature.getId() === fid);
      if (!foundFeature) {
        return;
      }

      // zoom to feature
      ViewAnimationUtil.to(this.map.getView(), foundFeature.getGeometry());

      const correspondingInteraction = MapInteractionUtil.getSelectInteraction(this.map, this.layerId);

      // we can only select layers that have a select interaction
      if (!correspondingInteraction) {
        return;
      }

      // add to map selection
      correspondingInteraction.getFeatures().clear();
      correspondingInteraction.getFeatures().push(foundFeature);
    },

    /**
     * Load features from layer and display it in
     * in the table.
     */
    populateTable () {
      if (!this.map || !this.layerId) {
        return;
      }

      // reset table properties
      this.records = [];
      this.features = [];
      this.headers = [];
      this.selectedRow = [];
      this.page = 1;

      this.layer = LayerUtil.getLayerByLid(this.layerId, this.map);

      // load currently available features
      this.prepareTableDataAndColumns()

      // features can only be loaded if layer is visible
      // that's why we switch the layers on and retrieve them
      // once the features are available
      // https://github.com/openlayers/openlayers/blob/main/doc/faq.md#why-arent-there-any-features-in-my-source
      this.layer.getSource().on('change', this.prepareTableDataAndColumns);
      this.layer.setVisible(true);
    },

    /**
     * Loads the features from the layer source and
     * prepares the required columns for the table.
     */
    prepareTableDataAndColumns () {
      this.features = this.layer.getSource().getFeatures();
      this.applyColumnMapping();
    },

    /**
     * Read column mapping from layer property.
     * Otherwise we retrieve it from the feature
     * properties names.
     */
    applyColumnMapping () {
      if (!this.layer.getSource() ||
          !this.layer.getSource().getFeatures() ||
          !this.layer.getSource().getFeatures()[0]
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
        let keys = this.layer.getSource().getFeatures()[0].getKeys();
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
