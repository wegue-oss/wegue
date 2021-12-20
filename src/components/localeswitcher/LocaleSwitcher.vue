<template>
  <v-menu offset-y nudge-bottom="15"
      transition="scale-transition"
      v-model="show">
      <template v-slot:activator="{ on, attrs}">
        <v-btn
          borderless
          dense 
          color="onprimary"
          background-color="transparent" 
          :title="$t('wgu-localeswitcher.title')"
          class="ma-2"
          icon
          v-on="on"
          v-bind="attrs"
        >
          <v-icon class="mr-1" medium>{{icon}}</v-icon>
          {{ $i18n.locale }} 
        </v-btn>
      </template>
    
      <v-list>
        <v-list-item class="wgu-langlist-item" 
          v-for="langCode in Object.keys(lang)" 
          :key="langCode" 
          @click="onItemClick(langCode)">
          <v-list-item-content>
            <v-list-item-title>
              {{ lang[langCode] }} ({{ langCode }})
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
</template>

<script>
import LocaleUtil from '../../util/Locale'

export default {
  name: 'wgu-localeswitcher',
  props: {
    icon: { type: String, required: false, default: 'language' }
  },
  data () {
    return {
      show: false,
      lang: LocaleUtil.getSupportedLanguages(this.$appConfig)
    }
  },
  methods: {
    /**
     * Change the i18n and built-in vuetify locale.
     */
    onItemClick (langCode) {
      this.$i18n.locale = this.$vuetify.lang.current = langCode;
    }
  }
}
</script>
