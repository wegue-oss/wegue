<template>
  <v-app id="wgu-app" data-app :class="{ 'wgu-app': true, 'wgu-app-embedded': isEmbedded }">

    <slot name="wgu-app-begin" />

    <wgu-app-header>
      <!-- forward the slots of AppHeader -->
      <template v-slot:wgu-tb-start>
        <slot name="wgu-tb-start" />
      </template>
      <template v-slot:wgu-tb-after-title>
        <slot name="wgu-tb-after-title" />
      </template>
      <template v-slot:wgu-tb-before-auto-buttons>
        <slot name="wgu-tb-before-auto-buttons" />
      </template>
      <template v-slot:wgu-tb-after-auto-buttons>
        <slot name="wgu-tb-after-auto-buttons" />
      </template>
      <template v-slot:wgu-tb-end>
        <slot name="wgu-tb-end" />
      </template>
    </wgu-app-header>

    <slot name="wgu-after-header" />

    <wgu-app-sidebar v-if="sidebarWins.length" v-bind="sidebarConfig">
        <template v-for="(moduleWin, index) in sidebarWins" :key="index">
          <component
            v-bind="moduleWin"
            :is="moduleWin.type"
          />
      </template>
    </wgu-app-sidebar>

    <slot name="wgu-before-content" />
    <v-main app>
      <v-container id="ol-map-container" fluid class="fill-height pa-0 position-relative">
        <wgu-map />
        <!-- layer loading indicator -->
        <wgu-maploading-status />
        <slot name="wgu-after-map" />
        <!-- Teleport to overlay the map content from an application module -->
        <div id="wgu-map-teleport" />
        <wgu-app-logo />
        <wgu-bglayerswitcher />
        <wgu-overviewmap v-if="overviewMapConfig" v-bind="overviewMapConfig"/>
        <!-- Register custom overlays, e.g. feature hover components here -->
        <wgu-hover-tooltip />
      </v-container>
    </v-main>

    <template v-for="(moduleWin, index) in floatingWins" :key="index">
      <component
        v-bind="moduleWin"
        :is="moduleWin.type"
      />
    </template>

    <slot name="wgu-before-footer" />

    <wgu-app-footer
      :footerTextLeft="$t('app.footerTextLeft')"
      :footerTextRight="$t('app.footerTextRight')"
      :showCopyrightYear="showCopyrightYear"
    />

    <slot name="wgu-after-footer" />

    <!-- app wide loading mask,
    use WguEventBus.$emit('app-loading-mask-toggle', newViz) to show/hide -->
    <wgu-app-loading-mask />

    <slot name="wgu-app-end" />

  </v-app>
</template>

<script>
import { getCurrentInstance } from 'vue';
import { WguEventBus } from '@/WguEventBus';
import OlMap from '@/components/ol/Map.vue';
import HoverTooltip from '@/components/ol/HoverTooltip.vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppLogo from '@/components/AppLogo.vue';
import AppLoadingMask from '@/components/AppLoadingMask.vue';
import BgLayerSwitcher from '@/components/bglayerswitcher/BgLayerSwitcher.vue';
import OverviewMap from '@/components/overviewmap/OverviewMap.vue';
import MeasureWin from '@/components/measuretool/MeasureWin.vue';
import LayerListWin from '@/components/layerlist/LayerListWin.vue';
import HelpWin from '@/components/helpwin/HelpWin.vue';
import InfoClickWin from '@/components/infoclick/InfoClickWin.vue';
import MapLoadingStatus from '@/components/progress/MapLoadingStatus.vue';
import AttributeTableWin from '@/components/attributeTable/AttributeTableWin.vue';
import MapRecorderWin from '@/components/maprecorder/MapRecorderWin.vue';
import SampleModuleWin from './components/SampleModule.vue';

export default {
  name: 'wgu-app-tpl',
  components: {
    'wgu-map': OlMap,
    'wgu-hover-tooltip': HoverTooltip,
    'wgu-app-header': AppHeader,
    'wgu-app-footer': AppFooter,
    'wgu-app-sidebar': AppSidebar,
    'wgu-app-logo': AppLogo,
    'wgu-app-loading-mask': AppLoadingMask,
    'wgu-bglayerswitcher': BgLayerSwitcher,
    'wgu-overviewmap': OverviewMap,
    'wgu-measuretool-win': MeasureWin,
    'wgu-layerlist-win': LayerListWin,
    'wgu-helpwin-win': HelpWin,
    'wgu-infoclick-win': InfoClickWin,
    'wgu-maploading-status': MapLoadingStatus,
    'wgu-attributetable-win': AttributeTableWin,
    'wgu-maprecorder-win': MapRecorderWin,
    'sample-module-win': SampleModuleWin
  },
  setup () {
    const vueInstance = getCurrentInstance();
    return { vueInstance };
  },
  data () {
    return {
      isEmbedded: false,
      sidebarConfig: this.getSidebarConfig(),
      overviewMapConfig: this.getOverviewMapConfig(),
      floatingWins: this.getModuleWinData('floating'),
      sidebarWins: this.getModuleWinData('sidebar'),
      showCopyrightYear: this.$appConfig.showCopyrightYear
    }
  },
  created () {
    this.setGlobalAppLang(); // initially set global app language lookup
    this.setDocumentTitle();
  },
  mounted () {
    // apply the isEmbedded state to the member var
    this.isEmbedded = this.$isEmbedded;

    // make the refs (floating module window, which are not connected to their
    // related components, e.g. buttons to toggle them)
    const refs = this.$refs;
    const cmpLookup = {};
    for (const key of Object.keys(refs)) {
      cmpLookup[key] = refs[key][0];
    }
    this.vueInstance.appContext.config.globalProperties.cmpLookup = cmpLookup;
    // inform registered cmps that the app is mounted and the dynamic
    // components are available
    WguEventBus.$emit('app-mounted');
  },
  methods: {
    /**
       * Returns the configuration object for the sidebar from app-config.
       * @return {Object} Sidebar configuration object.
       */
    getSidebarConfig () {
      const appConfig = this.$appConfig || {};
      return appConfig.sidebar;
    },
    /**
       * Returns the configuration object for the overview map from app-config.
       * @return {Object} Overview map configuration object.
       */
    getOverviewMapConfig () {
      const appConfig = this.$appConfig || {};
      return appConfig.overviewMap;
    },
    /**
       * Determines the module window configuration objects from app-config:
       *     moduleWins: [
       *       {type: 'wgu-layerlist-win'},
       *       {type: 'wgu-measuretool-win'}
       *     ]
       * @param  {String} target Either 'floating' or 'sidebar'
       * @return {Array} module window configuration objects
       */
    getModuleWinData (target) {
      const appConfig = this.$appConfig || {};
      const modulesConfs = appConfig.modules || {};
      const moduleWins = [];
      for (const key of Object.keys(modulesConfs)) {
        const moduleOpts = appConfig.modules[key];
        if (moduleOpts.win === target) {
          moduleWins.push({
            type: (moduleOpts.moduleType ?? key) + '-win',
            moduleName: key,
            ...moduleOpts
          });
        }
      }
      return moduleWins;
    },
    /**
     * Sets the document title from language file.
     */
    setDocumentTitle () {
      document.title = this.$t('app.browserTitle') || document.title;
    },
    /**
     * Sets the current i18n language to the global app language lookup.
     */
    setGlobalAppLang () {
      this.vueInstance.appContext.config.globalProperties.$appLanguage = this.$i18n.locale;
    }
  },
  watch: {
    /**
     * Watch for locale changes.
     */
    '$i18n.locale': function () {
      this.setGlobalAppLang();
      this.setDocumentTitle();
    }
  }
};
</script>
