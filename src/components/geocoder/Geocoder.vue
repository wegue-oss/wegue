<template>
<v-toolbar-items class="d-flex align-center justify-center">
  <v-combobox
    v-show="!hideSearch"
    class="wgu-geocoder-combo wgu-solo-field"
    variant="outlined"
    density="compact"
    width="320"
    :color="isPrimaryDarkWithLightTheme ? 'white' : 'accent'"
    :theme="isDarkTheme ? 'dark' : 'light'"
    return-object
    hide-details
    :no-filter="noFilter"
    v-model="selected"
    :autofocus="autofocus"
    :items="resultItems"
    :label="$t('wgu-geocoder.placeHolder')"
    :clearable="clearable"
    :persistent-hint="persistentHint"
    :hidden="hideSearch"
    :rounded="rounded"
    @update:search="search"
  ></v-combobox>

  <div>

    <v-btn @click='toggle()'
      :icon="icon"
      :title="$t('wgu-geocoder.title')">
    </v-btn>

  </div>
</v-toolbar-items>
</template>

<script>
import { Mapable } from '../../mixins/Mapable';
import { useColorTheme } from '../../composables/ColorTheme';
import { GeocoderController } from './GeocoderController';
import { applyTransform } from 'ol/extent';
import { getTransform, fromLonLat } from 'ol/proj';
import ViewAnimationUtil from '../../util/ViewAnimation';

export default {
  name: 'wgu-geocoder-input',
  mixins: [Mapable],
  props: {
    icon: { type: String, required: false, default: 'md:search' },
    rounded: { type: Boolean, required: false, default: true },
    autofocus: { type: Boolean, required: false, default: true },
    clearable: { type: Boolean, required: false, default: true },
    persistentHint: { type: Boolean, required: false, default: true },
    debug: { type: Boolean, required: false, default: false },
    minChars: { type: Number, required: false, default: 3 },
    queryDelay: { type: Number, required: false, default: 300 },
    provider: { type: String, required: false, default: 'osm' },
    providerOptions: { type: Object, required: false, default: function () { return {}; } }

  },
  setup () {
    const { isDarkTheme, isPrimaryDark, isPrimaryDarkWithLightTheme } = useColorTheme();
    return { isDarkTheme, isPrimaryDark, isPrimaryDarkWithLightTheme };
  },
  data () {
    return {
      results: [],
      lastQueryStr: '',
      noFilter: true,
      selecting: false,
      selected: null,
      hideSearch: true,
      timeout: null
    }
  },
  computed: {
    resultItems () {
      const items = [];
      if (!this.results) {
        return items;
      }
      this.trace(`computed.resultItems() - cur results len=${this.results.length}`);

      // Convert results to v-combobox (title, value) Items
      this.results.forEach(result => {
        this.trace(`add to this.items: ${result.address.name}`);
        items.push({ title: result.address.name, value: result });
      });

      return items;
    }
  },
  methods: {
    trace (str) {
      this.debug && console && console.info(str);
    },
    toggle () {
      // Show/hide search combobox
      this.hideSearch = !this.hideSearch;
    },
    // Query by string - should return list of selection items (adresses) for ComboBox
    querySelections (queryStr) {
      this.timeout = setTimeout(() => {
        // Let Geocoder Provider do the query
        // items (item.title fields) will be shown in combobox dropdown suggestions
        this.trace(`geocoderController.query: ${queryStr}`);
        this.geocoderController.query(queryStr)
          .then(results => this.onQueryResults(results))
          .catch(err => this.onQueryError(err))
      }, this.queryDelay);
    },
    onQueryResults (results) {
      // Handle query results from GeocoderController
      this.timeout && clearTimeout(this.timeout);
      this.timeout = null;
      this.results = null;

      if (!results || results.length === 0) {
        return;
      }

      // ASSERT: results is defined and at least one result
      this.trace(`results ok: len=${results.length}`);
      this.results = results;
    },
    onQueryError (err) {
      if (err) {
        this.trace(`onQueryResult error: ${err}`);
      }
    },
    // Input string value changed
    search (queryStr) {
      if (this.timeout || this.selecting) {
        // Query or selection in progress
        this.trace('query or selection in progress...');
        return;
      }
      if (!queryStr || queryStr.length === 0) {
        // Query reset
        this.trace('queryStr none');
        this.results = null;
        return
      }

      // ASSERTION: queryStr is valid
      queryStr = queryStr.trim();

      // Only query if minimal number chars typed and querystring has changed
      queryStr.length >= this.minChars && queryStr !== this.lastQueryStr && this.querySelections(queryStr);
      this.lastQueryStr = queryStr;
    }
  },
  watch: {
    // User has selected entry from suggested items
    selected (item) {
      if (!item || !Object.prototype.hasOwnProperty.call(item, 'title') || !Object.prototype.hasOwnProperty.call(item, 'value')) {
        return;
      }
      this.selecting = true;
      this.trace(`selected=${item.title}`);

      // Position Map on result
      const result = item.value;
      const mapProjection = this.map.getView().getProjection();
      const coords = fromLonLat([result.lon, result.lat], mapProjection);

      // Prefer zooming to bounding box if present in result
      if (Object.prototype.hasOwnProperty.call(result, 'boundingbox')) {
        // Result with bounding box.
        // bbox is in EPSG:4326, needs to be transformed to Map Projection (e.g. EPSG:3758)
        const extent = applyTransform(result.boundingbox, getTransform('EPSG:4326', mapProjection));
        ViewAnimationUtil.to(this.map.getView(), extent);
      } else {
        // No bbox in result: center on lon/lat from result and zoom in
        ViewAnimationUtil.to(this.map.getView(), coords);
      }
      this.selecting = false;
    }
  },
  mounted () {
    // Setup GeocoderController to which we delegate Provider and query-handling
    this.geocoderController = new GeocoderController(this.provider, this.providerOptions, this);
  }
}
</script>
