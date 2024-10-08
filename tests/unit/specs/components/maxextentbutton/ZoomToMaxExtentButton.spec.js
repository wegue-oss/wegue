import { shallowMount } from '@vue/test-utils';
import ZoomToMaxExtentButton from '@/components/maxextentbutton/ZoomToMaxExtentButton';
import OlMap from 'ol/Map';
import OlView from 'ol/View';

const appConfig = {
  mapCenter: [0, 0],
  mapZoom: 0
};

function createWrapper ($appConfig = {}) {
  return shallowMount(ZoomToMaxExtentButton, {
    global: {
      mocks: {
        $appConfig
      }
    }
  });
}

describe('maxextentbutton/ZoomToMaxExtentButton.vue', () => {
  let comp;
  let vm;

  beforeEach(() => {
    comp = createWrapper(appConfig);
    vm = comp.vm;
  });

  // Check methods
  it('has a method onClick', () => {
    expect(typeof vm.onClick).to.equal('function');
  });

  it('onClick sets correct center and zoom', () => {
    vm.map = new OlMap({
      view: new OlView({
        center: [1, 1],
        zoom: 1
      })
    });

    // Remarks: This works synchronously, if no animation is used.
    vm.onClick();

    expect(vm.map.getView().getCenter()[0]).to.equal(0);
    expect(vm.map.getView().getCenter()[1]).to.equal(0);
    expect(vm.map.getView().getZoom()).to.equal(0);
  });

  afterEach(() => {
    comp.unmount();
  });
});
