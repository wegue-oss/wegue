import { shallowMount } from '@vue/test-utils';
import InfoClickToggleBtn from '@/components/infoclick/ToggleButton'

describe('infoclick/ToggleButton.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof InfoClickToggleBtn).to.not.equal('undefined');
  });

  it('has a created hook', () => {
    expect(typeof InfoClickToggleBtn.created).to.equal('function');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(InfoClickToggleBtn);
    });

    it('has correct default props', () => {
      expect(comp.vm.icon).to.equal('info');
      expect(comp.vm.text).to.equal('');
      expect(comp.vm.dark).to.equal(false);
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(InfoClickToggleBtn);
    });

    it('has correct default data', () => {
      expect(comp.vm.moduleName).to.equal('wgu-infoclick');
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(InfoClickToggleBtn);
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
