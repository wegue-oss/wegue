<template>
  <div class="text-xs-center">
      <v-menu>
        <template #activator="{ on: menu }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn icon :dark="dark"  v-on="{ ...tooltip, ...menu }">
                <v-icon medium>{{icon}}</v-icon>
                {{text}}
              </v-btn>
              <textarea id="textstore" ref="textstore" style="display: none; position: relative"></textarea>
            </template>
            <span>{{hoverText}}</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-tile
            v-for="(item, index) in items"
            :key="index"
            @click="onClick(item.action)"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
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
<!--  <div>-->
<!--    <div>-->
<!--    <v-btn icon :dark="dark" @click="onClick">-->
<!--      <v-icon medium>{{icon}}</v-icon>-->
<!--      {{text}}-->
<!--    </v-btn>-->
<!--    <textarea id="textstore" ref="textstore" style="display: none; position: relative"></textarea>-->
<!--    </div>-->
<!--    <v-alert-->
<!--      class="wgu-alert"-->
<!--        :value="alert"-->
<!--        :dark="dark"-->
<!--        type="info"-->
<!--        transition="fade-transition"-->
<!--      >-->
<!--      {{alertText}}-->
<!--    </v-alert>-->
<!--  </div>-->
</template>

<script>

import { Mapable } from '../../mixins/Mapable';

export default {
  name: 'wgu-share-btn',
  mixins: [Mapable],
  props: {
    icon: {type: String, required: false, default: 'share'},
    text: {type: String, required: false, default: ''},
    hoverText: {type: String, required: false, default: 'Share permalink'},
    alertText: {type: String, required: false, default: 'Copied'},
    alertTimeMillis: {type: Number, required: false, default: 1000},
    dark: {type: Boolean, required: false, default: false}
  },
  data () {
    return {
      alert: false,
      items: [
        { title: 'Copy URL', action: 'copy' },
        { title: 'Copy HTML Embed Code', action: 'embed' }
        // { title: 'Email URL', action: 'email' }
      ]
    }
  },
  methods: {
    onClick (action) {
      // Get permalink URL and copy to clipboard
      const permalinkController = this.map.get('permalinkcontroller');
      if (!permalinkController) {
        console.error('no permalink controller available!');
        return true;
      }
      try {
        // Copy to clipboard: selected text needs to be visible so
        // toggle textarea short time
        let text;

        if (action === 'copy') {
          text = permalinkController.getShareUrl();
        } else if (action === 'embed') {
          text = permalinkController.getEmbedHTML();
        } else {
          console.error('no permalink controller available!');
          return true;
        }
        const textArea = this.$refs.textstore;
        // Show and select  textarea
        textArea.style.display = 'block';
        textArea.value = text;
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
