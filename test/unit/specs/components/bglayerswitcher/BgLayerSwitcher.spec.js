import { mount, shallowMount } from '@vue/test-utils';
import BgLayerSwitcher from '@/components/bglayerswitcher/BgLayerSwitcher';

describe('bglayerswitcher/BgLayerSwitcher.vue', () => {
  it('is defined', () => {
    expect(BgLayerSwitcher).to.not.be.an('undefined');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(BgLayerSwitcher);
    });

    it('has correct default props', () => {
      expect(comp.vm.color).to.equal('red darken-3');
      expect(comp.vm.icon).to.equal('map');
      expect(comp.vm.dark).to.equal(true);
      expect(comp.vm.emptyText).to.equal('No background layers available.');
      expect(comp.vm.imageWidth).to.equal(152);
      expect(comp.vm.imageHeight).to.equal(114);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(BgLayerSwitcher);
    });

    it('has correct default data', () => {
      expect(comp.vm.show).to.equal(false);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('user interactions', () => {
    let comp;

    // Remarks: The following is necessary to avoid warnings.
    //  For reasons not fully understood the test utils will fail to attach
    //  the v-menu to the wgu-bglayerswitcher-wrapper div element created
    //  in the component.
    const div = document.createElement('div');
    div.id = 'wgu-bglayerswitcher-wrapper';
    document.body.appendChild(div);

    beforeEach(() => {
      comp = mount(BgLayerSwitcher, {
        created () {
          this.$vuetify.theme = { dark: false };
        }
      });
    });

    it('button click switches show', done => {
      expect(comp.vm.show).to.equal(false);

      const button = comp.findComponent({name: 'v-btn'});
      button.trigger('click');

      comp.vm.$nextTick(() => {
        expect(comp.vm.show).to.equal(true);
        done();
      });
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
