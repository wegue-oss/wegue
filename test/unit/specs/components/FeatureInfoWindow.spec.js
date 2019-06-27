import { shallowMount } from '@vue/test-utils';
import FeatureInfoWindow from '@/components/FeatureInfoWindow';
import Feature from 'ol/Feature';

describe('InfoWindow.vue', () => {
  // Evaluate the raw data
  it('is defined', () => {
    expect(typeof FeatureInfoWindow).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(FeatureInfoWindow);
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.layerId).to.equal(undefined);
      expect(vm.imageProp).to.equal(undefined);
      expect(vm.titleProp).to.equal(undefined);
      expect(vm.icon).to.equal(undefined);
      expect(vm.title).to.equal(undefined);
    });
  });

  describe('data', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(FeatureInfoWindow);
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.feature).to.equal(null);
      expect(vm.attributes).to.equal(null);
      expect(vm.left).to.equal('300px');
      expect(vm.top).to.equal('200px');
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(FeatureInfoWindow);
      vm = comp.vm;
    });

    it('setFeature resets if no feature passed', () => {
      vm.setFeature();
      expect(vm.feature).to.equal(null);
      expect(vm.attributes).to.equal(null);
    });

    it('setFeature sets feature data if feature passed', () => {
      const feat = new Feature({
        name: 'foo'
      });
      vm.setFeature(feat);
      expect(vm.feature).to.equal(feat);
      expect(vm.attributes.name).to.equal(feat.getProperties().name);
    });
  });
});
