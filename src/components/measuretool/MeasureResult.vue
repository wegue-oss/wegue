<template>
  <div class="">
    <div class="measure-result" v-if="measureType === 'distance' || measureType === 'area'">
      {{ $t("wgu-measuretool.length") }}: {{distance}}
    </div>
    <div class="measure-result" v-if="measureType === 'area'">
      {{ $t("wgu-measuretool.area") }}: {{area}}
    </div>
    <div class="measure-result" v-if="measureType === 'angle'">
      {{ $t("wgu-measuretool.angle") }}: {{angle}}
    </div>
  </div>
</template>

<script>
import { useMap } from '@/composables/Map';
import AngleUtil from '@/util/Angle';
import LineStringGeom from 'ol/geom/LineString';
import { getArea, getLength } from 'ol/sphere';

const EMPTY_RESULT_TEXT = ' -- ';

export default {
  name: 'wgu-measure-result',
  props: {
    measureGeom: { type: Object },
    measureType: { type: String }
  },
  setup () {
    const { map } = useMap(this);
    return { map };
  },
  data () {
    return {
      area: EMPTY_RESULT_TEXT,
      distance: EMPTY_RESULT_TEXT,
      angle: EMPTY_RESULT_TEXT
    }
  },
  watch: {
    measureGeom () {
      const geom = this.measureGeom.geom;
      let output;
      if (geom && this.measureType === 'area') {
        output = this.formatArea(geom);
        this.area = output;

        // perimeter of outer LinearRing of measure polygon
        this.distance = this.formatLength(new LineStringGeom(
          geom.getLinearRing(0).getCoordinates()
        ));
      } else if (geom && this.measureType === 'distance') {
        output = this.formatLength(geom);
        this.distance = output;
      } else if (geom && this.measureType === 'angle') {
        this.angle = this.formatAngle(geom);
      } else {
        this.area = EMPTY_RESULT_TEXT;
        this.distance = EMPTY_RESULT_TEXT;
        this.angle = EMPTY_RESULT_TEXT;
      }
    }
  },
  methods: {
    /**
     * Calculates and formats the length of the given line.
     *
     * @param  {ol.geom.LineString} line The LineString object to calculate length for
     */
    formatLength (line) {
      const mapSrs = this.map.getView().getProjection().getCode();
      const length = getLength(line, { projection: mapSrs });
      let output;
      if (length > 100) {
        output = this.$t('wgu-measuretool.lengthKm',
          [Math.round(length / 1000 * 100) / 100]);
      } else {
        output = this.$t('wgu-measuretool.lengthMeter',
          [Math.round(length * 100) / 100]);
      }
      return output;
    },
    /**
     * Calculates and formats the area of the given polygon.
     *
     * @param  {ol.geom.Polygon} polygon The Polygon object to calculate area for
     */
    formatArea (polygon) {
      const mapSrs = this.map.getView().getProjection().getCode();
      const area = getArea(polygon, { projection: mapSrs });
      let output;
      if (area > 10000) {
        output = this.$t('wgu-measuretool.areaSquareKm',
          [Math.round(area / 1000000 * 100) / 100]);
      } else {
        output = this.$t('wgu-measuretool.areaSquareMeter',
          [Math.round(area * 100) / 100]);
      }
      return output;
    },

    /**
     * Calculates and formats the angle of the given 2 point line.
     */
    formatAngle (line) {
      const coords = line.getCoordinates();
      const numCoords = coords.length;
      if (numCoords < 2) {
        return EMPTY_RESULT_TEXT;
      }

      const firstPoint = coords[0];
      const lastPoint = coords[1];

      // when clicked only once the geom is a line with 2 identical points
      const isSamePoint = firstPoint.toString() === lastPoint.toString();
      if (isSamePoint) {
        return EMPTY_RESULT_TEXT;
      }

      let angle = AngleUtil.angle360(firstPoint, lastPoint);
      angle = AngleUtil.makeZeroDegreesAtNorth(angle);
      angle = AngleUtil.makeClockwise(angle);
      angle = angle.toFixed(2);

      return angle + '°';
    }
  }
};
</script>

<style>

  .measure-result {
    font-size: 14px;
    padding-left: 8px;
    padding-bottom: 8px;
  }

</style>
