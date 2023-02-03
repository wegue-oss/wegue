<template>
  <v-navigation-drawer
      class="wgu-app-sidebar"
      ref="sidebar"
      app
      clipped
      :width=sidebarWidth
      v-model="sidebarOpen"
      >
      <!-- Forward the default slot for sidebar content. -->
      <slot></slot>
      <!-- Sidebar toggle button -->
      <template v-slot:prepend>
        <v-btn small
          class="wgu-app-sidebar-toggle-btn px0"
          absolute
          top
          color="secondary"
          @click="sidebarOpen = !sidebarOpen">
          <v-icon color="onsecondary" v-if="sidebarOpen">chevron_left</v-icon>
          <v-icon color="onsecondary" v-else>chevron_right</v-icon>
        </v-btn>
      </template>
      <!-- Invisible sidebar resizer -->
      <div v-if="resizable"
        class="wgu-app-sidebar-resizer"
        @mousedown.prevent="onResize"
      />
  </v-navigation-drawer>
</template>

<script>

import { WguEventBus } from '../../src/WguEventBus';

export default {
  name: 'wgu-app-sidebar',
  props: {
    width: { type: Number, required: false, default: 400 },
    minWidth: { type: Number, required: false, default: NaN },
    maxWidth: { type: Number, required: false, default: NaN },
    visible: { type: Boolean, required: false, default: true },
    autoScroll: { type: Boolean, required: false, default: true },
    scrollDuration: { type: Number, required: false, default: 500 },
    resizable: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      sidebarOpen: this.visible,
      sidebarWidth: this.width
    }
  },
  /**
   * Initialize the sidebar.
   */
  created () {
    WguEventBus.$on('sidebar-scroll', comp => {
      this.scrollTo(comp);
    });
    WguEventBus.$on('sidebar-toggle', (open) => {
      // toggle or force a opening state of the sidebar
      if (typeof open === 'boolean') {
        this.sidebarOpen = open;
      } else {
        this.sidebarOpen = !this.sidebarOpen;
      }
    });
  },
  methods: {
    /**
     * Scroll to a module, if the 'autoScroll' option is enabled.
     * @param {string | HTMLElement | Vue} comp The component to scroll to.
     */
    scrollTo (comp) {
      if (this.autoScroll) {
        this.$vuetify.goTo(comp, {
          container: '.wgu-app-sidebar > .v-navigation-drawer__content',
          duration: this.scrollDuration
        });
      }
    },
    /**
     * Resize the sidebar, if the 'resizable' option is enabled.
     */
    onResize () {
      const sidebarEl = this.$refs.sidebar.$el;
      sidebarEl.style.transition = 'initial';

      // Resize on mouse move
      const onMouseMove = (e) => {
        document.body.style.cursor = 'ew-resize';
        let w = e.clientX;
        w = Number.isNaN(this.minWidth) ? w : Math.max(this.minWidth, w);
        w = Number.isNaN(this.maxWidth) ? w : Math.min(this.maxWidth, w);
        this.sidebarWidth = w;
      }
      document.addEventListener('mousemove', onMouseMove, false);

      // Stop the interaction on the next mouse up.
      const onMouseUp = () => {
        sidebarEl.style.transition = '';
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', onMouseMove, false);
      }
      document.addEventListener('mouseup', onMouseUp, { once: true });
    }
  }
}
</script>