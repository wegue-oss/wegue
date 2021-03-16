<template>
  <v-card
     class="wgu-attributetable"
     v-if="show"
  >
  <wgu-attributetable
  layerId="places"
  :columnMapping="columnMapping"
  >
  </wgu-attributetable>

  </v-card>
</template>

<script>
import { Mapable } from '../../mixins/Mapable';
import AttributeTable from './AttributeTable';

export default {
  name: 'wgu-attributetable-win',
  data () {
    return {
      show: false,
      columnMapping: {
        NAME: 'Name',
        ADM0NAME: 'Country',
        POP_MAX: 'Population',
        TIMEZONE: 'Timezone'
      }
    }
  },
  mixins: [Mapable],
  components: {
    'wgu-attributetable': AttributeTable
  }
};
</script>

<style scoped>
.wgu-attributetable {
  position: absolute;
  top: 90px;
  left: 16px;
  z-index: 2;
}
</style>
