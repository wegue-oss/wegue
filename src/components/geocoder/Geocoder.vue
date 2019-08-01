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
  import {GeocoderController} from './GeocoderController';
  import {applyTransform} from 'ol/extent';
  import {getTransform, fromLonLat} from 'ol/proj';

  export default {
    name: 'wgu-geocoder-input',
    mixins: [Mapable],
    props: {
      buttonIcon: {type: String, required: false, default: 'search'},
      label: {type: String, required: false, default: 'Nominatim Search'},
      rounded: {type: Boolean, required: false, default: true},
      autofocus: {type: Boolean, required: false, default: true},
      dark: {type: Boolean, required: false, default: false},
      persistentHint: {type: Boolean, required: false, default: true}
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
        }, this.queryDelay);
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
        if (!item.hasOwnProperty('text') || !item.hasOwnProperty('value')) {
          return;
        }

        this.debug && console.log(`selected=${item.text}`);

        // Position Map on result
        const result = item.value;
        const mapProjection = this.map.getView().getProjection();
        const coords = fromLonLat([result.lon, result.lat], mapProjection);

        // Prefer zooming to bounding box if present in result
        if (result.hasOwnProperty('boundingbox')) {
          // Result with bounding box.
          // bbox is in EPSG:4326, needs to be transformed to Map Projection (e.g. EPSG:3758)
          const extent = applyTransform(result.boundingbox, getTransform('EPSG:4326', mapProjection));
          this.map.getView().fit(extent);
        } else {
          // No bbox in result: center on lon/lat from result and zoom in
          this.map.getView().setZoom(this.selectZoom);
        }
        this.map.getView().setCenter(coords);
      }
    },
    mounted () {
      this.config = this.$appConfig.modules['wgu-geocoder'] || null;
      if (!this.config) {
        alert('No geocoder config defined')
      }
      this.debug = this.config.debug || false;
      this.minChars = this.config.minChars || 5;
      this.queryDelay = this.config.queryDelay || 300;
      this.selectZoom = this.config.selectZoom || 16;

      this.geocoder = new GeocoderController(this.config.provider, this.config.providerOptions)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
