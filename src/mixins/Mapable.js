import { WguEventBus } from '../WguEventBus.js'

/**
 * Mixin, which binds the OL map to the target component.
 * Executes the onMapBound function of the target component, if available.
 */
export const Mapable = {
  created () {
    // if the OL map is not present in the vue prototype we have to wait until
    // it is mounted. Otherwise apply OL map as member var.
    if (!this.$map) {
      // apply OL map once OL map is mounted
      WguEventBus.$on('ol-map-mounted', (olMap) => {
        // make the OL map accessible in this component
        this.map = olMap;

        if (this.onMapBound) {
          this.onMapBound();
          this.unbound = false;
        }
      });
    } else {
      // OL map is already mounted --> directly apply as member
      this.map = this.$map;
      if (this.onMapBound) {
        this.onMapBound();
        this.unbound = false;
      }
    }
    WguEventBus.$on('ol-map-unmounted', () => {
      // Make the OL map unaccessible in this component
      if (this.onMapUnbound) {
        this.onMapUnbound();
        this.unbound = true;
      }
    });
  }
};
