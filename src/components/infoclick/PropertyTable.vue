<template>

  <table class="wgu-proptable" v-if="show" :style="tableStyles">
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

import vColors from 'vuetify/es5/util/colors';
import ColorUtil from '../../util/Color';

export default {
  name: 'wgu-property-table',
  props: {
    color: {type: String, required: false, default: 'red darken-3'},
    properties: {type: Object}
  },
  computed: {
    tableStyles () {
      // calculate border color of tables due to current color property
      let borderColor = this.color;
      if (!ColorUtil.isCssColor(this.color)) {
        let [colorName, colorModifier] = this.color.toString().trim().split(' ', 2);
        borderColor = vColors[colorName];
        if (colorModifier) {
          colorModifier = colorModifier.replace('-', '');
          borderColor = vColors[colorName][colorModifier];
        }
      }
      return {
        'border': '2px solid ' + borderColor
      };
    },
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
