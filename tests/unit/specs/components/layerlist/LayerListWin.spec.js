import { shallowMount } from '@vue/test-utils';
import LayerListWin from '@/components/layerlist/LayerListWin';

function createWrapper () {
  return shallowMount(LayerListWin);
}

describe('layerlist/LayerListWin.vue', () => {
  let comp;
  let vm;

  beforeEach(() => {
    comp = createWrapper();
    vm = comp.vm;
  });

  it('has the correct properties', () => {
    expect(vm.icon).to.equal('md:layers');
    expect(vm.showLegends).to.equal(true);
    expect(vm.showOpacityControls).to.equal(true);
  });

  it('does not render on startup', () => {
    expect(comp.text()).to.equal('');
  });
});
