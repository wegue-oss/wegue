import { shallowMount } from '@vue/test-utils';
import AttributeTableToggleBtn from '@/components/attributeTable/ToggleButton'

describe('attributeTable/ToggleButton.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof AttributeTableToggleBtn).to.not.equal('undefined');
  });

  it('has a created hook', () => {
    expect(typeof AttributeTableToggleBtn.created).to.equal('function');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(AttributeTableToggleBtn);
    });

    it('has correct default props', () => {
      expect(comp.vm.icon).to.equal('table_chart');
      expect(comp.vm.text).to.equal('');
      expect(comp.vm.dark).to.equal(false);
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(AttributeTableToggleBtn);
    });

    it('has correct default data', () => {
      expect(comp.vm.moduleName).to.equal('wgu-attributetable');
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(AttributeTableToggleBtn);
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
