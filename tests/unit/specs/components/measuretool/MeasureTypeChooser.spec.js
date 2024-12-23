import { nextTick } from 'vue';
import { shallowMount } from '@vue/test-utils';
import MeasureTypeChooser from '@/components/measuretool/MeasureTypeChooser';

function createWrapper () {
  return shallowMount(MeasureTypeChooser);
}

describe('measuretool/MeasureTypeChooser.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(MeasureTypeChooser).to.not.be.an('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.measureType).to.equal('distance');
      expect(vm.showAngleTool).to.be.false;
      expect(vm.iconsOnly).to.be.false;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.measureTypeData).to.equal('distance');
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('watchers', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('watcher measureTypeData fires event "wgu-measuretype-change"', async () => {
      vm.measureTypeData = 'kalle';
      await nextTick();

      expect(comp.emitted()['wgu-measuretype-change']).to.have.lengthOf(1);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
