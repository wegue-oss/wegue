<template>
  <v-toolbar-items class="d-flex align-center justify-center">
    <v-combobox
      v-show="!hideSearch"
      class="wgu-geocoder-combo wgu-solo-field"
      variant="outlined"
      density="compact"
      :width="width"
      :min-width="width ? undefined : minWidth"
      :max-width="width ? undefined : maxWidth"
      :list-props="{ nav: true, density: 'compact' }"
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
      :rounded="rounded"
      @update:search="search"
    ></v-combobox>

    <div>

      <v-btn @click='toggle()'
        :style="{ height: false }"
        :icon="icon"
        :title="$t('wgu-geocoder.title')">
      </v-btn>

    </div>
  </v-toolbar-items>
</template>

<script>
import { useMap } from '@/composables/Map';
import { useColorTheme } from '@/composables/ColorTheme';
import { GeocoderController } from './GeocoderController';
import { applyTransform } from 'ol/extent';
import { getTransform, fromLonLat } from 'ol/proj';
import ViewAnimationUtil from '@/util/ViewAnimation';
import axios from 'axios';

export default {
  name: 'wgu-geocoder-input',
  props: {
    icon: { type: String, required: false, default: 'md:search' },
    width: { type: Number, required: false, default: undefined },
    minWidth: { type: Number, required: false, default: 175 },
    maxWidth: { type: Number, required: false, default: 300 },
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
    const { map } = useMap();
    const { isDarkTheme, isPrimaryDark, isPrimaryDarkWithLightTheme } = useColorTheme();

    return { map, isDarkTheme, isPrimaryDark, isPrimaryDarkWithLightTheme };
  },
  data () {
    return {
      results: null,
      lastQueryStr: '',
      noFilter: true,
      selecting: false,
      selected: null,
      hideSearch: true,
      debounceTimeout: null
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
  mounted () {
    // Setup GeocoderController to which we delegate Provider and query-handling
    this.geocoderController = new GeocoderController(this.provider, this.providerOptions);
  },
  unmounted () {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }

    this.geocoderController.destroy();
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
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      this.debounceTimeout = setTimeout(() => {
        // Let Geocoder Provider do the query
        // items (item.title fields) will be shown in combobox dropdown suggestions
        this.trace(`geocoderController.query: ${queryStr}`);
        this.geocoderController.query(queryStr)
          .then(results => this.onQueryResults(results))
          .catch(err => {
            if (!axios.isCancel(err)) {
              this.onQueryError(err);
            }
          });
        this.debounceTimeout = null;
      }, this.queryDelay);
    },
    onQueryResults (results) {
      // Handle query results from GeocoderController
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
      if (this.selecting) {
        // Selection in progress
        this.trace('selection in progress...');
        return;
      }
      if (!queryStr || queryStr.length === 0) {
        // Query reset
        this.trace('queryStr none');
        this.results = null;
        return;
      }
      // ASSERTION: queryStr is valid
      queryStr = queryStr.trim();

      // Only query if minimal number chars typed and querystring has changed
      if (queryStr.length >= this.minChars && queryStr !== this.lastQueryStr) {
        this.querySelections(queryStr);
        this.lastQueryStr = queryStr;
      }
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
      const viewAnimationUtil = new ViewAnimationUtil(this.$appConfig.viewAnimation);

      // Prefer zooming to bounding box if present in result
      if (Object.prototype.hasOwnProperty.call(result, 'boundingbox')) {
        // Result with bounding box.
        // bbox is in EPSG:4326, needs to be transformed to Map Projection (e.g. EPSG:3758)
        const extent = applyTransform(result.boundingbox, getTransform('EPSG:4326', mapProjection));
        viewAnimationUtil.to(this.map.getView(), extent);
      } else {
        // No bbox in result: center on lon/lat from result and zoom in
        const coords = fromLonLat([result.lon, result.lat], mapProjection);
        viewAnimationUtil.to(this.map.getView(), coords);
      }
      this.selecting = false;
    }
  }
};
</script>
