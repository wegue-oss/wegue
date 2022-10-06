<template>
  <v-navigation-drawer
      class="wgu-app-sidebar"
      app
      clipped
      :width=width
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
  </v-navigation-drawer>
</template>

<script>

import { WguEventBus } from '../../src/WguEventBus'

export default {
  name: 'wgu-app-sidebar',
  props: {
    width: { type: Number, required: false, default: 400 },
    visible: { type: Boolean, required: false, default: true },
    autoScroll: { type: Boolean, required: false, default: true },
    scrollDuration: { type: Number, required: false, default: 500 }
  },
  data () {
    return {
      sidebarOpen: this.visible
    }
  },
  /**
   * Initialize the sidebar.
   */
  created () {
    WguEventBus.$on('sidebar-scroll', comp => {
      this.scrollTo(comp);
    });
    WguEventBus.$on('sidebar-toggle', () => {
      this.sidebarOpen = !this.sidebarOpen;
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
    }
  }
}
</script>