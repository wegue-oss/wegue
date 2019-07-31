<template>

  <v-toolbar-items>
    <v-combobox
      v-model="selected"
      :autofocus="autofocus"
      :items="items"
      :label="label"
      append-icon=""
      :dark="dark"
      :persistent-hint="persistentHint"
      :hidden="showSearch"
      :rounded="rounded"
      :search-input.sync="search"
    ></v-combobox>
    
    <v-btn @click='toggle()' icon :dark="dark" slot="activator">
      <v-icon medium>{{buttonIcon}}</v-icon>
    </v-btn>
  </v-toolbar-items>

</template>

<script>
  import {Mapable} from '../../mixins/Mapable';
  import {PROVIDERS, Nominatim} from './nominatim';
  import {applyTransform} from 'ol/extent';
  import {getTransform} from 'ol/proj';

  export default {
    name: 'wgu-geocoder-input',
    mixins: [Mapable],
    props: {
      buttonIcon: {type: String, required: false, default: 'search'},
      label: {type: String, required: false, default: 'Nominatim Search'},
      rounded: {type: Boolean, required: false, default: true},
      autofocus: {type: Boolean, required: false, default: true},
      dark: {type: Boolean, required: false, default: false},
      persistentHint: {type: Boolean, required: false, default: true},
      provider: {type: String, required: false, default: PROVIDERS.OSM},
      minChars: {type: Number, required: false, default: 5},
      queryDelayMillis: {type: Number, required: false, default: 300},
      debug: {type: Boolean, required: false, default: false}
    },
    data () {
      return {
        items: [],
        lastSearch: '',
        search: '',
        selected: null,
        showSearch: true,
        timeout: null
      }
    },
    methods: {
      toggle () {
        this.showSearch = !this.showSearch
      },
      querySelections (str) {
        this.debug && console.info('querySelections:', str);
        this.timeout && clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          // Let Geocoder Provider do the query
          // items (item.text fields) will be shown in suggestions
          this.debug && console.info('issueQuery:', str);
          this.items = this.geocoder.query(str);
        }, this.queryDelayMillis);
      }
    },
    watch: {
      // Input string value changed
      search (str) {
        if (!str || str.length === 0) {
          this.items = [];
          return;
        }

        this.debug && console.info('search:', str);
        // Only query when input changed from last with minimum number of chars
        str && str !== this.lastSearch && str.length >= this.minChars && this.querySelections(str);
        this.lastSearch = str;
      },
      // User has selected entry from suggested items
      selected (item) {
        if (!item.hasOwnProperty('text')) {
          return;
        }

        this.debug && console.log(`selected=${item.text}`);
        // bbox is in EPSG:4326, needs to be transformed to Map Projection (e.g. EPSG:3758)
        // TODO: not all Providers return a bbox, need view.setCenter()/.setZoom() then
        const bbox = item.value.boundingbox.map(x => Number.parseFloat(x));
        let extent = [bbox[2], bbox[0], bbox[3], bbox[1]];
        extent = applyTransform(extent, getTransform('EPSG:4326', this.map.getView().getProjection()));
        this.map.getView().fit(extent);
      }
    },
    mounted () {
      this.geocoder = new Nominatim()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
