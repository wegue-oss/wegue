<template>
  <v-card
     class="wgu-attributetable"
     v-if="show"
  >
  <wgu-attributetable
  layerId="places"
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
      show: false
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
