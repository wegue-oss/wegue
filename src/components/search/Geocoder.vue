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
      :search-input.sync="search"
    ></v-combobox>
    
    <v-btn @click='toggle()' icon :dark="dark" slot="activator">
      <v-icon medium>{{icon}}</v-icon>
        {{text}}
      </v-btn>
  </v-toolbar-items>

</template>

<script>
  import {Mapable} from '../../mixins/Mapable';
  import {PROVIDERS, Nominatim} from './nominatim';

  export default {
    name: 'wgu-geocoder-input',
    mixins: [Mapable],
    props: {
      color: {type: String, required: false, default: 'red darken-3'},
      icon: {type: String, required: false, default: 'search'},
      text: {type: String, required: false},
      label: {type: String, required: false, default: 'Nominatim Search'},
      autofocus: {type: Boolean, required: false, default: true},
      dark: {type: Boolean, required: false, default: false},
      persistentHint: {type: Boolean, required: false, default: true},
      provider: {type: String, required: false, default: PROVIDERS.OSM},
      minChars: {type: Number, required: false, default: 4},
      gueryDelayMillis: {type: Number, required: false, default: 3000}
    },
    data () {
      return {
        items: [],
        search: '',
        selected: '',
        showSearch: true
      }
    },
    computed: {
      searchResults () {
        console.info('searchResults computed:', this.selected);
        return []
      }
    },
    methods: {
      toggle () {
        this.showSearch = !this.showSearch
      },
      querySelections (val) {
        console.info('querySelections:', val);
        setTimeout(() => {
          this.items = this.geocoder.query(val);
        }, this.gueryDelayMillis);
      },
      onEnd () {
        // When all done center map, set marker etc
        const center = 'something';
        this.map.getView().setCenter(center);
      }
    },
    watch: {
      search (val) {
        console.log(`search=${val}`);
        val && val !== this.selected && val.length >= this.minChars && this.querySelections(val);
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
