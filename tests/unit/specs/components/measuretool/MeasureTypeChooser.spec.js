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
    expect(typeof MeasureTypeChooser).to.not.equal('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.measureType).to.equal('distance');
      expect(vm.showAngleTool).to.equal(false);
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
  });
});
