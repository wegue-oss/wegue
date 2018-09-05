import Vue from 'vue'
import ZoomToMaxExtentButton from '@/components/maxextentbutton/ZoomToMaxExtentButton'
import OlMap from 'ol/Map';
import OlView from 'ol/View';

describe('maxextentbutton/ZoomToMaxExtentButton.vue', () => {
  // Check methods
  it('has a method onClick', () => {
    const Constructor = Vue.extend(ZoomToMaxExtentButton);
    const ztmeb = new Constructor({
    }).$mount();
    expect(typeof ztmeb.onClick).to.equal('function');
  });

  it('onClick sets correct center and zoom', () => {
    const Constructor = Vue.extend(ZoomToMaxExtentButton);
    const ztmeb = new Constructor({
    }).$mount();

    ztmeb.$appConfig = {
      mapCenter: [0, 0],
      mapZoom: 0
    };
    ztmeb.map = new OlMap({
      view: new OlView({
        center: [1, 1],
        zoom: 1
      })
    });

    ztmeb.onClick();
    expect(ztmeb.map.getView().getCenter()[0]).to.equal(0);
    expect(ztmeb.map.getView().getCenter()[1]).to.equal(0);
    expect(ztmeb.map.getView().getZoom()).to.equal(0);
  });
});
