import { mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import OverviewMap from '@/components/overviewmap/OverviewMap';

describe('overviewmap/OverviewMap.vue', () => {
  const vuetify = new Vuetify();

  it('is defined', () => {
    expect(OverviewMap).to.not.be.an('undefined');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(OverviewMap, {
        vuetify
      });
      vm = comp.vm
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('zoom_out_map');
      expect(vm.visible).to.equal(true);
      expect(vm.rotateWithView).to.equal(true);
      expect(vm.width).to.equal(164);
      expect(vm.height).to.equal(178);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(OverviewMap, {
        vuetify
      });
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.open).to.equal(true);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('user interactions', () => {
    let comp;
    let vm;

    // Remarks: The following is necessary to avoid warnings.
    //  For reasons not fully understood the test utils will fail to attach
    //  the v-menu to the wgu-overviewmap-wrapper div element created
    //  in the component.
    const div = document.createElement('div');
    div.id = 'wgu-overviewmap-wrapper';
    document.body.appendChild(div);

    beforeEach(() => {
      comp = mount(OverviewMap, {
        vuetify
      });
      vm = comp.vm;
    });

    it('button click switches open', done => {
      expect(vm.open).to.equal(true);

      const button = comp.findComponent({ name: 'v-btn' });
      button.trigger('click');

      vm.$nextTick(() => {
        expect(vm.open).to.equal(false);
        done();
      });
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
