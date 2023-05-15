import Vue from 'vue';
import ViewAnimationUtil from '@/util/ViewAnimation';
import View from 'ol/View';
import { getCenter, containsExtent } from 'ol/extent';

const options = {
  duration: 20,
  zoom: 12,
  maxZoom: 13
};

const animTypes = ['none', 'pan', 'fly', 'bounce'];

const view = new View({
  center: [0, 0],
  zoom: 0
});

const extent = [966000, 6341000, 967000, 6342000];
const coordinate = [966000, 6341000];

describe('ViewAnimationUtil', () => {
  it('is defined', () => {
    expect(typeof ViewAnimationUtil).to.not.equal(undefined);
  });

  it('has the correct functions', () => {
    expect(typeof ViewAnimationUtil.getAnimation).to.equal('function');
    expect(typeof ViewAnimationUtil.getOptions).to.equal('function');
    expect(typeof ViewAnimationUtil.to).to.equal('function');
    expect(typeof ViewAnimationUtil.toLocation).to.equal('function');
    expect(typeof ViewAnimationUtil.toExtent).to.equal('function');
  });

  for (const animType of animTypes) {
    describe('animation type ' + animType, () => {
      beforeEach(() => {
        Vue.prototype.$appConfig = {
          viewAnimation: { type: animType, options: options }
        };
      });

      it('zooms to extent correctly', done => {
        ViewAnimationUtil.to(view, extent, (complete) => {
          expect(complete).to.equal(true);
          expect(containsExtent(view.calculateExtent(), extent)).to.equal(true);
          expect(view.getZoom()).to.equal(options.maxZoom);

          // Validate that the center points match.
          // Due to numeric issues, the values are rounded before comparison.
          const viewCenter = view.getCenter().map(v => Math.round(v));
          expect(viewCenter).to.eql(getCenter(extent));

          done();
        });
      });

      it('zooms to location correctly', done => {
        ViewAnimationUtil.to(view, coordinate, (complete) => {
          expect(complete).to.equal(true);
          expect(view.getZoom()).to.equal(options.zoom);

          // Validate that the views center point matches the location.
          // Due to numeric issues, the values are rounded before comparison.
          const viewCenter = view.getCenter().map(v => Math.round(v));
          expect(viewCenter).to.eql(coordinate);

          done();
        });
      });

      afterEach(() => {
        Vue.prototype.$appConfig = undefined;
      });
    });
  }
});
