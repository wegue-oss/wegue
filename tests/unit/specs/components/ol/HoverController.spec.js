import HoverController from '@/components/ol/HoverController';
import { WguEventBus } from '@/WguEventBus';
import OlMap from 'ol/Map';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';

// Test layers and feature
// The isVisible function of layers must be overwritten to prevent crashes.
const feat = new Feature({
  foo: 'bar',
  geometry: new Point([0, 0])
});
const layer = new VectorLayer({
  hoverable: true,
  hoverAttribute: 'foo',
  source: new VectorSource({
    features: [feat]
  })
});
layer.isVisible = () => { return true; };

const layerNonHoverable = new VectorLayer({
  hoverable: false,
  source: new VectorSource({
    features: [feat]
  })
});
layerNonHoverable.isVisible = () => { return true; };

const layerNotVisible = new VectorLayer({
  hoverable: true,
  hoverAttribute: 'foo',
  source: new VectorSource({
    features: [feat]
  })
});
layerNotVisible.isVisible = () => { return false; };

describe('ol/HoverController.js', () => {
  let comp;
  let map;

  it('is defined', () => {
    expect(HoverController).to.not.be.an('undefined');
  });

  describe('data', () => {
    beforeEach(() => {
      map = new OlMap({});
      comp = new HoverController(map);
    });

    it('has correct default data', () => {
      expect(comp.map).to.equal(map);
      expect(comp.timerHandle).to.be.null;
      expect(comp.activeOverlayId).to.be.null;
      expect(comp.pendingRequestsAbortCtrl).to.be.null;
      expect(comp.conf.delay).to.equal(150);
      expect(comp.conf.hideOnMousemove).to.be.false;
      expect(comp.conf.hoverOverlay).to.equal('wgu-hover-tooltip');
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('user interactions', () => {
    beforeEach(() => {
      map = new OlMap({});
      comp = new HoverController(map);
    });

    it('emits update-overlay event to show overlay when feature is hit', done => {
      // Setup map and overwrite functions to simulate hitting a valid feature.
      map.addLayer(layer);
      map.forEachLayerAtPixel = (pixel, callback, opts) => {
        callback(layer);
      };
      map.getFeaturesAtPixel = (evt, opts) => {
        return [feat];
      };

      WguEventBus.$once('wgu-hover-tooltip-update-overlay', (visible, position, data) => {
        expect(visible).to.be.true;
        expect(position).to.be.undefined;
        expect(data.feature).to.equal(feat);
        expect(data.layer).to.equal(layer);
        expect(data.hoverAttribute).to.equal('foo');
        done();
      });
      comp.onPointerRest({ pixel: [0, 0] });
    });

    it('does not emit update-overlay event when non hoverable layer is hit', done => {
      // Setup map and overwrite functions to simulate hitting a valid feature.
      map.addLayer(layerNonHoverable);
      map.forEachLayerAtPixel = (pixel, callback, opts) => {
        callback(layerNonHoverable);
      };
      map.getFeaturesAtPixel = (evt, opts) => {
        return [feat];
      };

      let eventEmitted = false;
      WguEventBus.$once('wgu-hover-tooltip-update-overlay', (visible, position, data) => {
        eventEmitted = true;
      });
      comp.onPointerRest({ pixel: [0, 0] });

      setTimeout(() => {
        expect(eventEmitted).to.be.false;
        done();
      }, 100);
    });

    it('does not emit update-overlay event when non visible layer is hit', done => {
      // Setup map and overwrite functions to simulate hitting a valid feature.
      map.addLayer(layerNotVisible);
      map.forEachLayerAtPixel = (pixel, callback, opts) => {
        callback(layerNotVisible);
      };
      map.getFeaturesAtPixel = (evt, opts) => {
        return [feat];
      };

      let eventEmitted = false;
      WguEventBus.$once('wgu-hover-tooltip-update-overlay', (visible, position, data) => {
        eventEmitted = true;
      });
      comp.onPointerRest({ pixel: [0, 0] });

      setTimeout(() => {
        expect(eventEmitted).to.be.false;
        done();
      }, 100);
    });

    it('emits update-overlay event to hide overlay when no feature is hit', done => {
      // Setup map and functions to simulate hitting a valid layer but not a valid feature.
      map.addLayer(layer);
      map.forEachLayerAtPixel = (pixel, callback, opts) => {
        callback(layer);
      };

      WguEventBus.$once('wgu-hover-tooltip-update-overlay', (visible, position, data) => {
        expect(visible).to.be.false;
        expect(position).to.be.undefined;
        expect(data).to.be.undefined;
        done();
      });
      comp.activeOverlayId = 'wgu-hover-tooltip';
      comp.onPointerRest({ pixel: [0, 0] });
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
