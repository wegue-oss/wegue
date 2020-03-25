<template>
  <div>
    <div>
    <v-btn icon :dark="dark" @click="onClick">
      <v-icon medium>{{icon}}</v-icon>
      {{text}}
    </v-btn>
    <textarea id="permalinkurl" ref="permalinkurl" style="display: none; position: relative"></textarea>
    </div>
    <v-alert
      class="wgu-alert"
        :value="alert"
        :dark="dark"
        type="info"
        transition="fade-transition"
      >
      {{alertText}}
    </v-alert>
  </div>
</template>

<script>

import { Mapable } from '../../mixins/Mapable';

export default {
  name: 'wgu-share-btn',
  mixins: [Mapable],
  props: {
    icon: {type: String, required: false, default: 'share'},
    text: {type: String, required: false, default: ''},
    alertText: {type: String, required: false, default: 'Link copied!'},
    alertTimeMillis: {type: Number, required: false, default: 750},
    dark: {type: Boolean, required: false, default: false}
  },
  data () {
    return {
      alert: false
    }
  },
  methods: {
    onClick () {
      // Get permalink URL and copy to clipboard
      const permalinkController = this.map.get('permalinkcontroller');
      if (!permalinkController) {
        console.error('no permalink controller available!');
        return true;
      }
      try {
        // Copy to clipboard: selected text needs to be visible so
        // toggle textarea short time
        const url = permalinkController.getShareUrl();
        const textArea = this.$refs.permalinkurl;
        // Show and select  textarea
        textArea.style.display = 'block';
        textArea.value = url;
        textArea.select();

        // Copy to clipboard
        document.execCommand('copy');
        // Hide textarea
        textArea.value = '';
        textArea.style.display = 'none';

        // Show short alert
        this.alert = true;
        window.setTimeout(() => {
          this.alert = false;
        }, this.alertTimeMillis);
      } catch (error) {
        console.error(error);
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .v-alert.wgu-alert {
    position: fixed;
    top: 5em;
    right: 4em;
    z-index: 1;
  }

</style>
