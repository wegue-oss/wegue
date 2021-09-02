<template>
  <v-navigation-drawer
      class="wgu-app-sidebar"
      app
      clipped
      :width=width
      :color=color
      v-model="sidebarOpen"
      >
      <!-- Forward the default slot for sidebar content. -->
      <slot></slot>
      <!-- Sidebar toggle button -->
      <template v-slot:prepend>
        <v-btn 
          class="wgu-app-sidebar-toggle-btn px0"
          absolute
          top
          :color=color
          width="20" min-width="20" 
          @click="sidebarOpen = !sidebarOpen"> 
          <v-icon v-if="sidebarOpen">chevron_left</v-icon> 
          <v-icon v-else>chevron_right</v-icon> 
        </v-btn>
      </template>
  </v-navigation-drawer>
</template>

<script>

export default {
  name: 'wgu-app-sidebar',
  data () {
    return {
      sidebarOpen: this.visible
    }
  },
  props: {
    color: {type: String, required: false, default: 'white'},
    width: {type: Number, required: false, default: 400},
    visible: {type: Boolean, required: false, default: true}
  }
}
</script>