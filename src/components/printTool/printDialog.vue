<template>

  <wgu-module-card v-bind="$attrs"
    :moduleName="moduleName"
    class="wgu-print-win"
    :icon="icon"
    v-on:visibility-change="show">

    <!-- Show feature properties and position tables -->

      <v-card-text class="no-data">
        {{ $t('wgu-print.subtitle') }}
      </v-card-text>

      <v-card-actions>
        <v-select
          v-model = "format"
          :items="Object.keys(dims)"
          :label="$t('wgu-print.dim')"
        ></v-select>
        <v-select
          v-model = "orientation"
          :items="Object.values(orientations)"
          :label="$t('wgu-print.orientation')"
        ></v-select>
        <v-select
          v-model = "resolution"
          :items="resolutions"
          :label="$t('wgu-print.resolution')"
        ></v-select>
        <v-select
          v-model = "scale"
          :items = "Object.keys(scales)"
          :label="$t('wgu-print.scale')"
        ></v-select>

        <v-btn
          text color="secondary"
          v-on:click="exportPDF"
          :disabled="allParams ? true : false"
        >
          {{ $t('wgu-print.exportClick')}}
        </v-btn>

        <div id="printmap"></div>

      </v-card-actions>

   </wgu-module-card>
</template>

<script>
import ModuleCard from './../modulecore/ModuleCard';
import { Mapable } from '../../mixins/Mapable';
import { ScaleLine } from 'ol/control.js';
import { getPointResolution } from 'ol/proj.js';
import html2canvas from 'html2canvas';
import { jsPDF as PDF } from 'jspdf';

export default {
  name: 'wgu-print-win',
  inheritAttrs: false,
  mixins: [Mapable],
  components: {
    'wgu-module-card': ModuleCard
  },
  props: {
    icon: { type: String, required: false, default: 'info' }
  },
  data: function () {
    return {
      moduleName: 'wgu-print',
      scaleLine: undefined,
      map: undefined,
      format: undefined,
      dims: {
        A0: [1189, 841],
        A1: [841, 594],
        A2: [594, 420],
        A3: [420, 297],
        A4: [297, 210],
        A5: [210, 148]
      },
      orientation: undefined,
      orientations: {
        landscape: this.$t('wgu-print.landscape'),
        portrait: this.$t('wgu-print.portrait')
      },
      resolution: undefined,
      resolutions: [
        '72',
        '150',
        '200',
        '300',
        '400'
      ],
      scale: undefined,
      scales: {
        '1:100000': 100,
        '1:50000': 50,
        '1:25000': 25,
        '1:10000': 10,
        '1:5000': 5
      }
    }
  },
  created () {
    if (this.$t('wgu-print.scales') && Array.isArray(this.$t('wgu-print.scales'))) {
      this.scales = {};
      this.$t('wgu-print.scales').forEach((element) => {
        this.scales['1:' + element] = element / 1000
      });
    }
    if (this.$t('wgu-print.resolutions') && Array.isArray(this.$t('wgu-print.resolutions'))) {
      this.resolutions = this.$t('wgu-print.resolutions')
    }
  },
  computed: {
    allParams () {
      return (!this.format || !this.orientation || !this.resolution || !this.scale)
    }
  },
  methods: {
    registerMapClick (unregister) {
      const me = this;

      if (unregister === true) {
        me.map.un('singleclick', me.onMapClick);
      } else {
        me.map.on('singleclick', me.onMapClick);
      }
    },

    /**
       * (Un-)Register map interactions when the visibility of the module changes.
       *
       * @param  {boolean} visible New visibility state
       */
    show (visible) {
      if (visible) {
        this.scaleLine = new ScaleLine({ bar: true, text: true, minWidth: 200 });
        this.map.addControl(this.scaleLine)
      } else {
        if (this.scaleLine) {
          this.map.removeControl(this.scaleLine);
          this.scaleLine = undefined;
        }
      }
    },

    exportPDF () {
      const mapElement = this.map.getTargetElement();
      const mapElementClass = mapElement.className;
      mapElement.className = '';
      let dim = this.dims[this.format];
      if (this.orientation === 'portrait') dim = dim.reverse();
      const scale = this.scales[this.scale];
      const width = Math.round((dim[0] * parseInt(this.resolution)) / 25.4);
      const height = Math.round((dim[1] * parseInt(this.resolution)) / 25.4);
      const viewResolution = this.map.getView().getResolution();
      const scaleResolution =
        scale /
        getPointResolution(
          this.map.getView().getProjection(),
          parseInt(this.resolution) / 25.4,
          this.map.getView().getCenter()
        );

      const me = this;
      const viewport = this.map.getViewport();

      this.map.once('rendercomplete', function () {
        const exportOptions = {
          useCORS: true,
          width,
          height,
          ignoreElements: function (element) {
            if (!element) return
            const className = element.className || '';
            if (typeof className !== 'string') return
            return (
              className.includes('ol-control') &&
              !className.includes('ol-scale') &&
              !className.includes('svg') &&
              (!className.includes('ol-attribution') ||
                !className.includes('ol-uncollapsible'))
            );
          }
        }
        html2canvas(viewport, exportOptions).then(function (canvas) {
          const pdf = new PDF({
            orientation: me.orientation,
            unit: 'mm',
            format: me.format
          });
          pdf.addImage(
            canvas.toDataURL('image/jpeg'),
            'JPEG',
            0,
            0,
            dim[0],
            dim[1]
          );
          pdf.save('map.pdf');
          // Reset original map size
          me.scaleLine.setDpi();
          mapElement.className = mapElementClass;
          mapElement.style.width = '';
          mapElement.style.height = '';
          me.map.updateSize();
          me.map.getView().setResolution(viewResolution);
        });
      });

      // Set print size
      this.scaleLine.setDpi(parseInt(this.resolution));
      mapElement.style.width = width + 'px';
      mapElement.style.height = height + 'px';
      console.log('render sizes', this.map.getTargetElement().style.width, this.map.getTargetElement().style.height)
      this.map.getView().setResolution(scaleResolution);
      this.map.updateSize();
    }

  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .wgu-print-win {
    width: 550px;
  }
</style>
