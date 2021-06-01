<template>
    <v-menu offset-x nudge-right="15"
      transition="scale-transition"
      :close-on-content-click="false"
      v-model="show"
      >
      <template v-slot:activator="{on}">
        <v-btn v-on="on"
          class="wgu-bglayerswitcher"
          :color="color" 
          :dark="dark"
          fab
          absolute
          >
          <v-icon medium>{{icon}}</v-icon>
        </v-btn>
      </template>
      <!-- Remarks: The layerlist is wrapped by an v-if block to avoid unneccesary image 
           requests when the layerlist is not visible -->
      <wgu-bglayerlist v-if="show"
        color="white"
        :dark="false"
        :selColor="color"
        :selDark="dark"
        :previewIcon="icon"
        :imageWidth="imageWidth"
        :imageHeight="imageHeight"
        :emptyText="emptyText"
        />
    </v-menu>
</template>

<script>
import BgLayerList from './BgLayerList';

export default {
  name: 'wgu-bglayerswitcher',
  components: {
    'wgu-bglayerlist': BgLayerList
  },
  props: {
    color: {type: String, required: false, default: 'red darken-3'},
    icon: {type: String, required: false, default: 'map'},
    dark: {type: Boolean, required: false, default: true},
    emptyText: {type: String, required: false, default: 'No background layers available.'},
    imageWidth: {type: Number, required: false, default: 152},
    imageHeight: {type: Number, required: false, default: 114}
  },
  data () {
    return {
      show: false
    }
  }
};
</script>
