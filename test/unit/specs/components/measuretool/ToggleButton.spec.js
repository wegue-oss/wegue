import { shallowMount } from '@vue/test-utils';
import MeasureToggleBtn from '@/components/measuretool/ToggleButton';

describe('measuretool/ToggleButton.vue', () => {
  it('has a created hook', () => {
    expect(typeof MeasureToggleBtn.created).to.equal('function');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(MeasureToggleBtn);
    });

    it('has correct default props', () => {
      expect(comp.vm.icon).to.equal('photo_size_select_small');
      expect(comp.vm.text).to.equal(undefined);
      expect(comp.vm.dark).to.equal(false);
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(MeasureToggleBtn);
    });

    it('has correct default data', () => {
      expect(comp.vm.moduleName).to.equal('wgu-measuretool');
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(MeasureToggleBtn);
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
