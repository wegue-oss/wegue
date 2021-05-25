<template>
  <v-navigation-drawer
      class="wgu-app-sidebar"
      app
      clipped
      width="400"
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
          color="white"
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
      sidebarOpen: true
    }
  }
}
</script>