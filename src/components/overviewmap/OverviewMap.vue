<!-- 
  This component wraps up an OpenLayers overview map and is attached directly to the 
  ol-map-container, currently without any vue speficic template code.
-->

<script>
import { Mapable } from '../../mixins/Mapable';
import OverviewMapController from './OverviewMapController';

export default {
  name: 'wgu-overviewmap',
  mixins: [Mapable],
  props: {
    color: { type: String, required: false, default: 'red darken-3' },
    collapsible: { type: Boolean, required: false, default: true },
    collapsed: { type: Boolean, required: false, default: true },
    label: { type: String, required: false, default: '\u00AB' },
    collapseLabel: { type: String, required: false, default: '\u00BB' },
    rotateWithView: { type: Boolean, required: false, default: true }
  },
  data () {
    return {
      layers: []
    }
  },
  render () {
  },
  destroyed () {
    this.destroy();
  },
  methods: {
    /**
     * This function is executed, after the map is bound (see mixins/Mapable).
     * Bind to the layers from the OpenLayers map.
     */
    onMapBound () {
      this.layers = this.map.getLayers().getArray();
      this.overviewMap = new OverviewMapController(this.map, this.$props);
    },
    /**
     * This function is executed, before the map is unbound (see mixins/Mapable)
     */
    onMapUnbound () {
      this.destroy();
    },
    /**
     * Tears down the overview map controller.
     */
    destroy () {
      if (this.overviewMap) {
        this.overviewMap.destroy();
        this.overviewMap = undefined;
      }
    }
  },
  computed: {
    /**
     * Reactive property to return the currently visible OpenLayers background layer.
     * To disambiguate multiple selected background layers - which may occur programmatically -
     * this returns the first in the list of background layers.
     */
    selectedBgLayer () {
      return this.layers
        .filter(layer => layer.get('isBaseLayer'))
        .reverse()
        .find(layer => layer.getVisible());
    }
  },
  watch: {
    /**
     * Watch for background layer selection change.
     */
    selectedBgLayer () {
      this.overviewMap.setLayer(this.selectedBgLayer);
    }
  }
};
</script>
