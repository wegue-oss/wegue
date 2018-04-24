// import Vue from 'vue';

import { WguEventBus } from '../WguEventBus.js'

/**
 * Mixin, which binds the OL map to the target component.
 * Executes the onMapBound function of the target component, if available.
 */
export const Mapable = {
  created: function () {
    WguEventBus.$on('ol-map-mounted', (olMap) => {
      // make the OL map accesible in this component
      this.map = olMap;

      if (this.onMapBound) {
        this.onMapBound();
      }
    });
  }
};
