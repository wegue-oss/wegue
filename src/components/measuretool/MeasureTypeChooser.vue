<template>

  <v-btn-toggle color="secondary" v-model="measureTypeData" mandatory>
    <v-btn large value="distance">
      <v-icon>
        mdi-vector-polyline
      </v-icon>
      <span v-if="!iconsOnly">
        {{ $t("wgu-measuretool.distance") }}
      </span>
     </v-btn>
     <v-btn large value="area">
      <v-icon>
        mdi-vector-square
      </v-icon>
      <span v-if="!iconsOnly">
        {{ $t("wgu-measuretool.area") }}
      </span>
     </v-btn>
     <v-btn large value="angle" v-if="showAngleTool">
      <v-icon>
        mdi-vector-line
      </v-icon>
      <span v-if="!iconsOnly">
        {{ $t("wgu-measuretool.angle") }}
      </span>
    </v-btn>
  </v-btn-toggle>

</template>

<script>
export default {
  name: 'wgu-measure-type-chooser',
  props: {
    measureType: { type: String, default: 'distance' },
    showAngleTool: { type: Boolean, default: false },
    iconsOnly: { type: Boolean, default: false }
  },
  data () {
    return {
      measureTypeData: this.measureType
    }
  },
  watch: {
    // listen to changed measurement type and forward to parent component
    measureTypeData (newVal, oldVal) {
      this.$emit('wgu-measuretype-change', newVal, oldVal);
    }
  }
}
</script>

<style>
</style>
