<template>

  <v-card-text class="px-0" v-if="show">
    <v-simple-table class="wgu-proptable">
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
    </v-simple-table>
  </v-card-text>
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.wgu-proptable {
  word-break: break-word;
}

.wgu-proptable td.key-td {
  width: 40%;
}
</style>
