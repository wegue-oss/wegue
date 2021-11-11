<template>

  <table class="wgu-proptable" v-if="show" style="border: 2px solid var(--v-secondary-base);">
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

.wgu-proptable td {
 background-color: #f9f9f9;
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
