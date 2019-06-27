import { shallowMount } from '@vue/test-utils';
import HelpWinToggleBtn from '@/components/helpwin/ToggleButton';

describe('helpwin/ToggleButton.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof HelpWinToggleBtn).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(HelpWinToggleBtn);
    });

    it('has correct default props', () => {
      expect(comp.vm.color).to.equal('red darken-3');
      expect(comp.vm.icon).to.equal('help');
      expect(comp.vm.text).to.equal(undefined);
      expect(comp.vm.dark).to.equal(false);
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(HelpWinToggleBtn);
    });

    it('has correct default data', () => {
      expect(comp.vm.show).to.equal(false);
    });
  });
});
