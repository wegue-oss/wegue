<!-- The template contains the HTML of our module  -->
<template>
  <!--
  Our module builds upon the 'wgu-module-card'
  it handles the integration into Wegue
  like adding a button in the toolbar
  -->
  <wgu-module-card
    v-bind="$attrs"
    class="sample-module"
    :icon="icon"
  >
    <!--
    Here goes the actual content of the module
    We use a the component 'v-card-text' from the Vuetify library
    -->
    <v-card-text>
      <!--
      Note the double curly brackets.
      They contain variables that dynamically change.
      The way how they change is done in the <script> part
      -->
      <b>Zoom:</b> {{ zoom }} <br />
      <b>Center:</b> {{ center }}
    </v-card-text>
  </wgu-module-card>
</template>

<script>
// the module card is a the template for a typical Wegue module
import ModuleCard from '@/components/modulecore/ModuleCard.vue';
// we import a so called "composable" that helps us to interact with the map
import { useMap } from '@/composables/Map';
// an OpenLayers helper function to display coordinates
import { toStringXY } from 'ol/coordinate';
// an OpenLayer helper function to transform coordinate reference systems
import { transform } from 'ol/proj';

export default {
  name: 'sample-module',
  inheritAttrs: false,
  components: {
    'wgu-module-card': ModuleCard
  },
  props: {
    icon: { type: String, required: false, default: 'md:star' }
  },
  // make sure to call the 'useMap' composable and return its resulting bindings
  setup () {
    const { map, layers } = useMap();
    return { map, layers };
  },
  // here we define variables that are used in the HTML above
  data () {
    return {
      zoom: '',
      center: ''
    };
  },
  watch: {
    map: {
      handler (newMap) {
        if (newMap) {
          this.onMapBound();
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * This function is called once the map is bound to the application
     */
    onMapBound () {
      // the 'useMap' composable provides access to our OpenLayer map
      // via its returned `map` binding. Returning this binding from
      // the `setup` lifecycle hook makes it accessible via 'this.map'
      // here we get the 'view' from the map
      const view = this.map.getView();
      // we call the function to extract zoom and center from the map
      // once it is initially created
      this.extractMapViewProperties(view);
      // to ensure that we react on updates of the map,
      // we need to register a listener
      view.on('change', () => {
        // always when the map view is changing we extract
        // the current zoom and center from it
        this.extractMapViewProperties(view);
      });
    },

    /**
     * We extract the current zoom and center coordinates
     * from the OpenLayers view and store the values
     * to our module's 'zoom' and 'center' variables
     *
     * @param {ol.View} view The OpenLayers view
     */
    extractMapViewProperties (view) {
      this.zoom = Math.round(view.getZoom());

      const sourceCrs = view.getProjection();
      const targetCrs = 'EPSG:4326';

      // we transform the coordinates from the map projection to WGS84 (EPSG:3857)
      const centerTargetCrs = transform(view.getCenter(), sourceCrs, targetCrs);

      // create a readable string from the coordinates
      this.center = toStringXY(
        centerTargetCrs,
        4 // <-- number of digits after comma
      );
    }
  }
};
</script>

<!-- Here we do the styling of our module -->
<style scoped>

  /* our module has the class '.sample-module' and we reference it here */
  .sample-module.wgu-floating {
    left: auto !important;
    top: 300px !important;
    right: 10px;
  }

</style>
