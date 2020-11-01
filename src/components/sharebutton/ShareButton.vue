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
          <v-list-tile @click="onCopyUrl()">
            <v-list-tile-action>
              <v-icon medium>link</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{copyUrlText}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="onCopyEmbedHTML()">
            <v-list-tile-action>
               <v-icon medium>code</v-icon>
             </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{copyEmbedHtmlText}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
               <v-icon medium>email</v-icon>
             </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title><a :href="mailToUrl">{{emailUrlText}}</a></v-list-tile-title>
            </v-list-tile-content>
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
</template>

<script>

import { Mapable } from '../../mixins/Mapable';
import {WguEventBus} from '../../WguEventBus';

export default {
  name: 'wgu-share-btn',
  mixins: [Mapable],
  props: {
    icon: {type: String, required: false, default: 'share'},
    text: {type: String, required: false, default: ''},
    hoverText: {type: String, required: false, default: 'Share permalink'},
    alertTimeMillis: {type: Number, required: false, default: 1000},
    alertCopiedText: {type: String, required: false, default: 'Copied'},
    alertErrorText: {type: String, required: false, default: 'An error occurred'},
    dark: {type: Boolean, required: false, default: false},
    copyUrlText: {type: String, required: false, default: 'Copy Hyperlink'},
    copyEmbedHtmlText: {type: String, required: false, default: 'Copy HTML Embed Code'},
    emailUrlText: {type: String, required: false, default: 'Email Hyperlink'},
    emailSubjectText: {type: String, required: false, default: 'Wegue Url Share'}
  },
  data () {
    return {
      alert: false,
      alertText: this.alertCopiedText,
      mailToUrl: this.emailUrlText
    }
  },
  mounted () {
    // Listen to the ol-map-mounted event and receive the OL map instance
    WguEventBus.$on('ol-map-mounted', (olMap) => {
      // Listen to map state changes (pan, zoom)
      this.map.on('moveend', () => {
        this.onMapChange();
      });
    });
  },
  methods: {
    showAlert (text) {
      // Show short alert
      this.alertText = text || this.alertCopiedText;
      this.alert = true;
      window.setTimeout(() => {
        this.alert = false;
      }, this.alertTimeMillis);
    },
    copyToClipboard (text) {
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
    },
    onCopyUrl () {
      // Get permalink URL and copy to clipboard
      try {
        // Copy to clipboard: selected text needs to be visible so
        // toggle textarea short time
        const permalinkController = this.map.get('permalinkcontroller');
        this.copyToClipboard(permalinkController.getShareUrl());
        this.showAlert();
      } catch (error) {
        this.showAlert(this.alertErrorText);
      }
    },
    onCopyEmbedHTML () {
      // Get permalink URL and copy to clipboard
      try {
        const permalinkController = this.map.get('permalinkcontroller');
        this.copyToClipboard(permalinkController.getEmbedHTML());
        this.showAlert();
      } catch (error) {
        this.showAlert(this.alertErrorText);
      }
    },
    setMailtoUrl: function () {
      // if (!this.map) {
      //   return 'Waiting for Map...';
      // }
      // https://css-tricks.com/snippets/html/mailto-links/
      // Get permalink URL and add to email Body
      try {
        const permalinkController = this.map.get('permalinkcontroller');
        const url = encodeURIComponent(permalinkController.getShareUrl());
        this.mailToUrl = `mailto:?subject=${this.emailSubjectText}&body=${url}`;
      } catch (error) {
        this.showAlert(this.alertErrorText);
      }
    },
    /**
     * Callback when Map View has changed, e.g. 'moveend'.
     */
    onMapChange () {
      this.setMailtoUrl();
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .v-alert.wgu-alert {
    position: fixed;
    top: 5em;
    right: 4em;
    z-index: 1;
  }
  a {
    color: inherit;
    text-decoration: none !important;
  }
</style>
