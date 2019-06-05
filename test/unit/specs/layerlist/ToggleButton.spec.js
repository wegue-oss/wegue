import { shallowMount } from '@vue/test-utils';
import LayerListToggleBtn from '@/components/layerlist/ToggleButton'

describe('infoclick/ToggleButton.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof LayerListToggleBtn).to.not.equal('undefined');
  });

  it('has a created hook', () => {
    expect(typeof LayerListToggleBtn.created).to.equal('function');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(LayerListToggleBtn);
    });

    it('has correct default props', () => {
      expect(comp.vm.icon).to.equal('layers');
      expect(comp.vm.text).to.equal('');
      expect(comp.vm.dark).to.equal(false);
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(LayerListToggleBtn);
    });

    it('has correct default data', () => {
      expect(comp.vm.moduleName).to.equal('wgu-layerlist');
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(LayerListToggleBtn);
      vm = comp.vm;
    });

    it('toggleUi switches show', () => {
      // mock a window UI instance
      vm.win = {show: false};
      vm.toggleUi();
      expect(vm.win.show).to.equal(true);
    });
  });
});
