<template>
  <v-menu
      location="bottom"
      offset="15"
      transition="scale-transition"
      v-model="show">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          borderless
          density="default"
          :title="$t('wgu-localeswitcher.title')"
          class="ma-2 wgu-menu-button"
          icon
        >
          <v-icon :icon="icon" class="mr-1"></v-icon>
          {{ $i18n.locale }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item class="wgu-langlist-item"
          v-for="langCode in Object.keys(lang)"
          :key="langCode"
          @click="onItemClick(langCode)">

            <v-list-item-title>
              {{ lang[langCode] }} ({{ langCode }})
            </v-list-item-title>

        </v-list-item>
      </v-list>
    </v-menu>
</template>

<script>
import LocaleUtil from '@/util/Locale';
import { useLocale } from 'vuetify';

export default {
  name: 'wgu-localeswitcher',
  props: {
    icon: { type: String, required: false, default: 'md:language' }
  },
  setup () {
    const { current: vuetifyLang } = useLocale();
    return { vuetifyLang };
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
      this.$i18n.locale = this.vuetifyLang = langCode;
    }
  }
};
</script>
