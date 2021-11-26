<template>
  <!-- Control to switch between light and dark mode -->
  <span>
    <v-btn @click="switchTheme" icon :color="color" :title="title">
      <v-icon :class="iconCls">dark_mode</v-icon>
    </v-btn>
  </span>
</template>

<script>
import { ColorTheme } from '../../mixins/ColorTheme';

export default {
  name: 'wgu-themeswitcher',
  mixins: [ColorTheme],
  props: {
    color: { type: String, required: false, default: null }
  },
  data: function () {
    return {};
  },

  computed: {
    /**
     * Returns the appropriate button tooltip
     * for light and dark mode
     */
    title: function () {
      return this.isDarkTheme
        ? this.$t('wgu-themeswitcher.title_dark_mode')
        : this.$t('wgu-themeswitcher.title_light_mode');
    },

    /**
     * Returns the appropriate button icon
     * for light and dark mode
     */
    iconCls: function () {
      return this.isDarkTheme ? 'material-icons' : 'material-icons-outlined';
    }
  },

  methods: {
    /**
     * Switches between light and dark mode
     */
    switchTheme: function () {
      this.$vuetify.theme.dark = !this.isDarkTheme;
    }
  }
};
</script>

<style scoped>
</style>
