<template>
  <v-card
    :class="cardClasses"
    :style="cardStyles"
    v-bind="cardAttr"
    v-if="show"
    v-draggable-win="cardDraggable"
  >
    <v-img :src="backgroundImage">
      <v-toolbar v-bind="toolbarAttr" class="pl-4 pr-1 py-0">
        <v-icon :icon="icon"></v-icon>
        <v-toolbar-title class="wgu-win-title">{{
          $t(moduleName + '.title')
        }}</v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- Slot for optional window toolbar content -->
        <slot name="wgu-win-toolbar"></slot>

        <v-spacer></v-spacer>
        <v-btn
          v-if="minimizable"
          icon
          size="small"
          @click="minimized = !minimized"
        >
          <v-icon v-if="minimized" icon="md:web_asset"></v-icon>
          <v-icon v-else icon="md:remove"></v-icon>
        </v-btn>
        <v-btn v-if="closable" icon="md:close" class="mr-0"
          @click="toggleUi">
        </v-btn>
      </v-toolbar>
    </v-img>

    <!-- Default slot for module content -->
    <div v-show="!minimized">
      <slot name="default"></slot>
    </div>
  </v-card>
</template>

<script>
import { DraggableWin } from '../../directives/DraggableWin';
import { WguEventBus } from '../../WguEventBus';
export default {
  name: 'wgu-module-card',
  inheritAttrs: false,
  directives: {
    DraggableWin
  },
  props: {
    // Common properties
    moduleName: { type: String, required: true },
    icon: { type: String, required: true },
    win: { type: String, required: false, default: 'floating' },
    minimizable: { type: Boolean, required: false, default: false },
    closable: { type: Boolean, required: false, default: true },
    backgroundImage: { type: String, required: false, default: undefined },
    visible: { type: Boolean, required: false, default: false },
    // Positioning / sizing properties will be ignored for sidebar cards.
    draggable: { type: Boolean, required: false, default: true },
    initPos: { type: Object, required: false },
    height: { type: [Number, String], required: false, default: undefined },
    width: { type: [Number, String], required: false, default: undefined },
    maxHeight: { type: [Number, String], required: false, default: undefined },
    maxWidth: { type: [Number, String], required: false, default: undefined },
    minHeight: { type: [Number, String], required: false, default: undefined },
    minWidth: { type: [Number, String], required: false, default: undefined }
  },
  data () {
    return {
      show: this.visible,
      minimized: false
    };
  },
  created () {
    WguEventBus.$on(this.moduleName + '-visibility-change', (visible) => {
      this.show = visible;
      this.$emit('visibility-change', visible);
    });
  },
  updated () {
    if (this.show && this.win === 'sidebar') {
      WguEventBus.$emit('sidebar-scroll', this);
    }
  },
  computed: {
    cardClasses () {
      const inheritedClasses = this.$attrs.class ? [this.$attrs.class] : []
      return this.win === 'floating'
        ? ['wgu-module-card', 'wgu-floating', ...inheritedClasses]
        : ['wgu-module-card', 'wgu-sidebar', ...inheritedClasses];
    },
    cardStyles () {
      return this.win === 'floating'
        ? {
            left: this.initPos ? this.initPos.left + 'px' : '0px',
            top: this.initPos ? this.initPos.top + 'px' : '0px'
          }
        : {};
    },
    cardAttr () {
      return this.win === 'floating'
        ? {
            height: this.height,
            width: this.width,
            maxHeight: this.maxHeight,
            maxWidth: this.maxWidth,
            minHeight: this.minHeight,
            minWidth: this.minWidth
          }
        : {};
    },
    cardDraggable () {
      return this.win === 'floating' ? this.draggable : false;
    },
    toolbarAttr () {
      return this.backgroundImage
        ? {
            dark: true,
            flat: true,
            color: 'transparent'
          }
        : {
            color: 'primary'
          };
    }
  },
  methods: {
    toggleUi () {
      WguEventBus.$emit(this.moduleName + '-visibility-change', !this.show);
    }
  }
};
</script>
