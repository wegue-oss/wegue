<template>
   <wgu-module-card v-bind="$attrs"
      moduleName="wgu-layerlist"
      class="wgu-layerlist"
      :icon="icon"
      >
      <wgu-layerlist 
        :showLegends="showLegends"
        :showOpacityControls="showOpacityControls"
      />
   </wgu-module-card>

</template>

<script>
import ModuleCard from './../modulecore/ModuleCard';
import LayerList from './LayerList';

export default {
  name: 'wgu-layerlist-win',
  inheritAttrs: false,
  components: {
    'wgu-module-card': ModuleCard,
    'wgu-layerlist': LayerList
  },
  props: {
    icon: { type: String, required: false, default: 'layers' },
    showLegends: { type: Boolean, required: false, default: true },
    showOpacityControls: { type: Boolean, required: false, default: true }
  }
}
</script>
