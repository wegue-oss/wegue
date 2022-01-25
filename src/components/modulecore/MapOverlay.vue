<template>
  <div v-show="false">
    <div ref="overlayContainer" >
      <!-- Default slot for overlay content -->
      <slot name="default" v-bind="contentData"></slot>
    </div>
  </div>
</template>

<script>
  import { WguEventBus } from '../../WguEventBus'
  import { Mapable } from '../../mixins/Mapable';
  import Overlay from 'ol/Overlay';
  export default {
    name: 'wgu-map-overlay',
    mixins: [Mapable],
    inheritAttrs: false,
    props: {
      overlayId: { type: String, required: true },
      visible: { type: Boolean, required: false, default: true },
      offset: { type: Array, required: false, default: undefined },
      positioning: { type: String, required: false, default: 'top-left' },
      coordinates: { type: Array, required: false, default: undefined },
      autoPan: { type: Boolean, required: false, default: false },
      autoPanDuration: { type: Number, required: false, default: 0 }
    },
    data () {
      return {
        show: this.visible,
        position: this.coordinates,
        olOverlay: null,
        contentData: null
      }
    },
    /**
     * Register for an event to update the overlays visiblity, position and content.
     */
    created () {
      WguEventBus.$on(this.overlayId + '-update-overlay', this.onUpdateOverlay);
    },
    /**
     * Destroy the overlay component.
     */
    destroyed () {
      WguEventBus.$off(this.overlayId + '-update-overlay', this.onUpdateOverlay);
      this.destroyOlOverlay();
    },
    methods: {
      /**
       * This function is executed, after the map is bound (see mixins/Mapable).
       * Create the overlay if visible.
       */
      onMapBound () {
        if (this.show) {
          this.createOlOverlay();
        }
      },
      /**
       * Event handler to update the overlays visibility, position and content.
       * The derived class can receive the content inside it's slot scope, in case
       * the overlay is populated with dynamic data.
       */
      onUpdateOverlay (visible, position, data) {
        if (visible) {
          this.position = position;
          this.contentData = data;
        }
        this.show = visible;
      },
      /**
       * Creates the OpenLayers overlay control and adds it to the map.
       */
      createOlOverlay () {
        if (!this.olOverlay) {
          var overlayContainer = this.$refs.overlayContainer;
          this.olOverlay = new Overlay({
            element: overlayContainer,
            id: this.overlayId,
            offset: this.offset,
            positioning: this.positioning,
            position: this.position,
            autoPan: this.autoPan,
            autoPanAnimation: {
              autoPanDuration: this.autoPanDuration
            }
          });
          this.map.addOverlay(this.olOverlay);
        }
      },
      /**
       * Destroys the OpenLayers overlay control and removes it from the map.
       */
      destroyOlOverlay () {
        if (this.olOverlay) {
          this.map.removeOverlay(this.olOverlay);
          this.olOverlay = undefined;
        }
      }
    },
    watch: {
      /**
       * Create / destroy the OpenLayers overlay control when the visibility toggles.
       */
      show () {
        if (this.show) {
          this.createOlOverlay();
        } else {
          this.destroyOlOverlay();
        }
      },
      /**
       * Update the position of the OpenLayers overlay control.
       */
      position () {
        if (this.olOverlay) {
          this.olOverlay.setPosition(this.position);
        }
      }
    }
  }
</script>
