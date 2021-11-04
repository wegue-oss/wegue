<template>
  <!-- Control to switch between light and dark mode -->
  <span>
    <v-btn @click="switchTheme" icon :color="color" :title="title">
      <v-icon :class="iconCls">dark_mode</v-icon>
    </v-btn>
  </span>
</template>

<script>
export default {
  name: 'wgu-themeswitcher',
  props: {
    color: { type: String, required: false, default: null }
  },
  data: function () {
    return {};
  },

  computed: {
    /**
     * Checks if the color theme is in dark mode.
     * Returns true if dark mode.
     */
    isDarkMode: function () {
      return this.$vuetify.theme.dark;
    },

    /**
     * Returns the appropriate button tooltip
     * for light and dark mode
     */
    title: function () {
      return this.isDarkMode
        ? this.$t('wgu-themeswitcher.title_dark_mode')
        : this.$t('wgu-themeswitcher.title_light_mode');
    },

    /**
     * Returns the appropriate button icon
     * for light and dark mode
     */
    iconCls: function () {
      return this.isDarkMode ? 'material-icons' : 'material-icons-outlined';
    }
  },

  methods: {
    /**
     * Switches between light and dark mode
     */
    switchTheme: function () {
      this.$vuetify.theme.dark = !this.isDarkMode;
    }
  }
};
</script>

<style scoped>
</style>
