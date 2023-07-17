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
import AngleUtil from '../../../src/util/Angle';
import LineStringGeom from 'ol/geom/LineString';
import { getArea, getLength } from 'ol/sphere.js';

export default {
  name: 'wgu-measure-result',
  props: {
    measureGeom: { type: Object },
    measureType: { type: String }
  },
  data () {
    return {
      area: ' -- ',
      distance: ' -- ',
      angle: ' -- '
    }
  },
  watch: {
    measureGeom () {
      const me = this;
      const geom = me.measureGeom.geom;
      let output;
      if (geom && this.measureType === 'area') {
        output = me.formatArea(geom);
        me.area = output;

        // perimeter of outer LinearRing of measure polygon
        me.distance = me.formatLength(new LineStringGeom(
          geom.getLinearRing(0).getCoordinates()
        ));
      } else if (geom && this.measureType === 'distance') {
        output = me.formatLength(geom);
        me.distance = output;
      } else if (geom && this.measureType === 'angle') {
        me.angle = me.formatAngle(geom);
      } else {
        me.area = ' -- ';
        me.distance = ' -- ';
        me.angle = ' -- ';
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
      const length = getLength(line);
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
      const area = getArea(polygon);
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
        return ' -- ';
      }

      const firstPoint = coords[0];
      const lastPoint = coords[1];

      // when clicked only once the geom is a line with 2 identical points
      const isSamePoint = firstPoint.toString() === lastPoint.toString();
      if (isSamePoint) {
        return ' -- ';
      }

      let angle = AngleUtil.angle360(firstPoint, lastPoint);
      angle = AngleUtil.makeZeroDegreesAtNorth(angle);
      angle = AngleUtil.makeClockwise(angle);
      angle = angle.toFixed(2);

      return angle + '°';
    }
  }
}
</script>

<style>

  .measure-result {
    font-size: 14px;
    padding-left: 8px;
    padding-bottom: 8px;
  }

</style>
