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

function createViewAnimationUtil (animType) {
  const $appConfig = {
    viewAnimation: { type: animType, options }
  };

  return new ViewAnimationUtil($appConfig);
}

describe('ViewAnimationUtil', () => {
  it('is defined', () => {
    expect(typeof ViewAnimationUtil).to.not.equal(undefined);
  });

  it('has the correct functions', () => {
    expect(typeof ViewAnimationUtil.prototype.getAnimation).to.equal('function');
    expect(typeof ViewAnimationUtil.prototype.getOptions).to.equal('function');
    expect(typeof ViewAnimationUtil.prototype.to).to.equal('function');
    expect(typeof ViewAnimationUtil.prototype.toLocation).to.equal('function');
    expect(typeof ViewAnimationUtil.prototype.toExtent).to.equal('function');
  });

  for (const animType of animTypes) {
    describe('animation type ' + animType, () => {
      beforeEach(() => {
        Vue.prototype.$appConfig = {
          viewAnimation: { type: animType, options }
        };
      });

      it('zooms to extent correctly', done => {
        const viewAnimationUtil = createViewAnimationUtil(animType);

        viewAnimationUtil.to(view, extent, (complete) => {
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
        const viewAnimationUtil = createViewAnimationUtil(animType);

        viewAnimationUtil.to(view, coordinate, (complete) => {
          expect(complete).to.equal(true);
          expect(view.getZoom()).to.equal(options.zoom);

          // Validate that the views center point matches the location.
          // Due to numeric issues, the values are rounded before comparison.
          const viewCenter = view.getCenter().map(v => Math.round(v));
          expect(viewCenter).to.eql(coordinate);

          done();
        });
      });
    });
  }
});
