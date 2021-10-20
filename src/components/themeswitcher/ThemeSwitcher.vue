<template>
  <span>
    <v-btn @click="switchTheme" icon dark :title="title">
      <v-icon :class="iconCls">dark_mode</v-icon>
    </v-btn>
  </span>
</template>

<script>
export default {
  name: 'wgu-themeswitcher',
  props: {},
  data: function () {
    return {};
  },

  computed: {
    isDarkMode: function () {
      return this.$vuetify.theme.dark;
    },

    title: function () {
      return this.isDarkMode
        ? this.$t('wgu-themeswitcher.title_dark_mode')
        : this.$t('wgu-themeswitcher.title_light_mode');
    },

    iconCls: function () {
      return this.isDarkMode ? 'material-icons' : 'material-icons-outlined';
    }
  },

  methods: {
    /**
     * Switch between light and dark mode
     */
    switchTheme: function () {
      this.$vuetify.theme.dark = !this.isDarkMode;
    }
  }
};
</script>

<style scoped>
</style>
