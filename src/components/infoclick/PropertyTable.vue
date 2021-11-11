<template>

  <table 
  :class="{
      'wgu-proptable': true,
      'light-theme': !isDark,
      'dark-theme': isDark
    }"
    v-if="show"
    style="border: 2px solid var(--v-secondary-base);"
  >
    <thead>
      <tr>
        <th v-for="(entry, key) in properties" :key="key">
        </th>
      </tr>
    </thead>
    <tbody class="attr-tbody">
      <tr v-for="(value, key) in properties" :key="key">
        <td class="key-td">
          {{key}}
        </td>
        <td class="val-td">
          {{value}}
        </td>
      </tr>
    </tbody>
  </table>

</template>

<script>

export default {
  name: 'wgu-property-table',
  props: {
    properties: { type: Object }
  },
  computed: {
    /**
     * Display the table control only, if there are properties to show.
     */
    show () {
      return this.properties && Object.keys(this.properties).length;
    },
    /**
     * Checks if color theme is in dark mode
     */
    isDark: function () {
      return this.$vuetify.theme.dark;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

table.wgu-proptable {
 border-radius: 3px;
 /* background-color: #fff; */
 width: 100%;
}

.wgu-proptable.dark-theme td {
  background-color: hsla(0, 0%, 98%, 0.03);
}

.wgu-proptable.light-theme td {
  background-color: hsla(0, 0%, 98%, 1);
}

.wgu-proptable tr {
  font-size: 16px;
}

.wgu-proptable th, .wgu-proptable td {
 width: 200px;
 padding: 5px 5px;
}

.wgu-proptable td.key-td {
  width: 160px;
  padding: 5px 5px;
}

</style>
