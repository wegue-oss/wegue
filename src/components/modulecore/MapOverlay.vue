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
      offset: { type: Array, required: false, default: undefined },
      positioning: { type: String, required: false, default: 'top-left' },
      visible: { type: Boolean, required: false, default: false }
    },
    data () {
      return {
        show: this.visible,
        position: undefined,
        olOverlay: null,
        contentData: null
      }
    },
    /**
     * Register for an event to update the overlays visiblity, position and content.
     * The derived class can receive the content inside it's slot scope, in case
     * the overlay is populated with dynamic data.
     */
    created () {
      WguEventBus.$on(this.overlayId + '-update-overlay',
        (visible, position, data) => {
          if (visible) {
            this.position = position;
            this.contentData = data;
          }
          this.show = visible;
        });
    },
    methods: {
      createOlOverlay () {
        if (!this.olOverlay) {
          var overlayContainer = this.$refs.overlayContainer;
          this.olOverlay = new Overlay({
            element: overlayContainer,
            id: this.overlayId,
            offset: this.offset,
            positioning: this.positioning,
            position: this.position
          });
          this.map.addOverlay(this.olOverlay);
        }
      },
      destroyOlOverlay () {
        if (this.olOverlay) {
          this.map.removeOverlay(this.olOverlay);
          this.olOverlay = undefined;
        }
      }
    },
    watch: {
      show () {
        if (this.show) {
          this.createOlOverlay();
        } else {
          this.destroyOlOverlay();
        }
      },
      position () {
        if (this.olOverlay) {
          this.olOverlay.setPosition(this.position);
        }
      }
    }
  }
</script>
