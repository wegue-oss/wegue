<template>
  <wgu-module-card v-bind="$attrs"
      :moduleName="moduleName"
      class="wgu-maprecorder-win" 
      :icon="icon" 
      width=350>
    
    <v-expansion-panels :multiple="true" :accordion="true" class="overflow-y-auto">
      <v-expansion-panel>
        <v-expansion-panel-header> 
          <v-layout align-center>
            <v-icon class="mr-4">settings</v-icon>
            {{ $t('wgu-maprecorder.options') }}
          </v-layout>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card
            flat
            color="transparent"
          >
          <v-subheader>{{ $t('wgu-maprecorder.videoFormat') }}</v-subheader>
            <v-card-text class="pt-0">
              <v-select
                  color="secondary"
                  item-color="secondary"
                  :menu-props="{
                    'offset-y': true,
                    bottom: true,
                  }"
                  v-model="mimeType"
                  :items="mimeTypes"
                  prepend-icon="mdi-video-image"
                  dense
                  hide-details>
              </v-select>
            </v-card-text>

            <v-subheader>{{ $t('wgu-maprecorder.frameRate') }}</v-subheader>
            <v-card-text class="pt-0">
              <v-slider
                  color="secondary"
                  prepend-icon="mdi-iframe-variable-outline"
                  v-model.number="frameRate"
                  min="20"
                  max="50"
                  step="1"
                  thumb-label
                  hide-details>
              </v-slider>
            </v-card-text>

            <v-subheader>{{ $t('wgu-maprecorder.bitRate') }}</v-subheader>
            <v-card-text class="pt-0">
              <v-slider
                  color="secondary"
                  prepend-icon="mdi-quality-high"
                  v-model.number="videoMBitsPerSecond"
                  min="1.0"
                  max="10.0"
                  step="0.1"
                  thumb-label
                  hide-details>
              </v-slider>
            </v-card-text>

            <v-subheader>{{ $t('wgu-maprecorder.fileName') }}</v-subheader>
            <v-card-text class="pt-0">
              <v-text-field
                color="secondary"
                v-model="filename"
                prepend-icon="mdi-rename-box"
                label="YYYY-MM-DD at HH.MM.SS"
                dense
                single-line
                hide-details
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card-actions class="pb-5">
      <v-row
        align-center
        justify-center
        no-gutters
        class="px-3"
      >
        <v-btn
          :block="!recording"
          :class="{
            'secondary': true,
            'onsecondary--text': true  
          }"
          @click="toggleRecord"
        >
          <template v-if="!recording">
            <v-icon left>fiber_manual_record</v-icon> 
            {{ $t('wgu-maprecorder.start') }}
          </template>
          <template v-else>
            <v-icon left>stop</v-icon> 
            {{ $t('wgu-maprecorder.stop') }}
          </template>
        </v-btn>

        <v-col class="px-2" align-self="center"> 
          <v-progress-linear
            color="secondary"
            :active="recording"
            buffer-value="0"
            stream
          ></v-progress-linear>
        </v-col>

        <v-col sm="12" md="12" lg="12">
          <v-alert
            v-model="error"
            type="error" 
            dismissible
            dense
            transition="scroll-y-transition"
            class="mt-2 mb-0"
          >
            {{ $t('wgu-maprecorder.error') }}
          </v-alert>
         </v-col>
      </v-row>
    </v-card-actions>
  </wgu-module-card>
</template>

<script>
import ModuleCard from './../modulecore/ModuleCard';
import { Mapable } from '../../mixins/Mapable';
import createCanvasRecorder from 'canvas-record';

export default {
  name: 'wgu-maprecorder-win',
  inheritAttrs: false,
  mixins: [Mapable],
  components: {
    'wgu-module-card': ModuleCard
  },
  props: {
    icon: { type: String, required: false, default: 'mdi-video' }
  },
  data () {
    const mimeTypes = this.getSupportedMimeTypes();

    return {
      moduleName: 'wgu-maprecorder',

      /**
       * Custom canvas element for drawing the OpenLayers map.
       */
      mapCanvas: null,
      /**
       * Context of the custom canvas element.
       */
      mapContext: null,
      /**
       * Canvas recorder.
       */
      recorder: null,
      /**
       * Recording state.
       */
      recording: false,
      /**
       * Filename of the video. Defaults to 'Recording YYYY-MM-DD'.
       */
      filename: undefined,
      /**
       * The frame rate used by the MediaRecorder.
       */
      frameRate: 25,
      /**
       * The video encoding bit rate in MBits/s.
       */
      videoMBitsPerSecond: 2.5,
      /**
       * The selected video codec.
       */
      mimeType: mimeTypes.length > 0 ? mimeTypes[0] : undefined,
      /**
       * The video codecs supported by the browser.
       */
      mimeTypes: mimeTypes,
      /**
       * Timer handle for canvas draw callbacks.
       */
      timerHandle: null,
      /**
       * An error occured on recording.
       */
      error: false
    }
  },
  methods: {
    /**
     * Starting from OpenLayers 6, layers are no longer composed to a single
     * Canvas element. The following function does custom rendering of all map
     * layers, code is taken from this example:
     * https://openlayers.org/en/latest/examples/export-map.html
     */
    drawCanvas () {
      var me = this;
      me.mapContext.fillStyle = 'white';
      me.mapContext.fillRect(0, 0, me.mapCanvas.width, me.mapCanvas.height);

      Array.prototype.forEach.call(
        document.querySelectorAll('.ol-layer canvas'),
        function (canvas) {
          if (canvas.width > 0) {
            var opacity = canvas.parentNode.style.opacity;
            me.mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

            // Get the transform parameters from the style's transform matrix
            // and apply the transform to the export map context.
            var transform = canvas.style.transform;
            /* eslint-disable-next-line no-useless-escape */
            var matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',').map(Number);
            CanvasRenderingContext2D.prototype.setTransform.apply(
              me.mapContext,
              matrix
            );
            me.mapContext.drawImage(canvas, 0, 0);
          }
        }
      );
    },

    /**
     * Starts / stops recording
     */
    toggleRecord () {
      var me = this;
      if (me.recording) {
        me.stopRecording();
      } else {
        me.startRecording();
      }
    },

    /**
     * Resize the canvas when the map changes. Only happens when recording
     * is active.
     */
    mapSizeChanged () {
      var me = this;
      var size = me.map.getSize();
      me.mapCanvas.width = size[0];
      me.mapCanvas.height = size[1];
    },

    /**
     * Create a custom canvas to render into, a map recorder and start the
     * capturing process.
     */
    startRecording () {
      var me = this;
      me.mapCanvas = document.createElement('canvas');
      me.mapSizeChanged();
      me.mapContext = me.mapCanvas.getContext('2d');
      me.drawCanvas();
      me.map.on('change:size', me.mapSizeChanged);
      me.timerHandle = setInterval(me.drawCanvas, 1000 / me.frameRate);

      try {
        me.recorder = createCanvasRecorder(me.mapCanvas, {
          filename: me.filename,
          frameRate: me.frameRate,
          recorderOptions: {
            videoBitsPerSecond: me.videoMBitsPerSecond * 1048576,
            mimeType: me.mimeType
          }
        });
        me.recorder.start();
      } catch (e) {
        me.error = true;
        me.stopRecording();
        return;
      }

      me.error = false;
      me.recording = true;
    },

    /**
     * Stop recording and free all associated resources.
     */
    stopRecording () {
      var me = this;
      if (me.recorder) {
        me.recorder.stop();
        me.recorder.dispose();
        me.recorder = null;
      }
      clearInterval(me.timerHandle);
      me.timerHandle = null;
      me.map.un('change:size', me.mapSizeChanged)
      me.mapContext = me.mapCanvas = null;
      me.recording = false;
    },

    /**
     * Returns video codecs supported by the browser. See
     * https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Containers
     */
    getSupportedMimeTypes () {
      return [
        'video/webm',
        'video/mp4',
        'video/ogg',
        'video/x-matroska',
        'video/quicktime',
        'video/3gpp'
      ].filter(mimeType => MediaRecorder.isTypeSupported(mimeType));
    }
  }
};
</script>
