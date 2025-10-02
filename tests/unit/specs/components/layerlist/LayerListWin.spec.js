import { shallowMount } from '@vue/test-utils';
import LayerListWin from '@/components/layerlist/LayerListWin.vue';

function createWrapper () {
  return shallowMount(LayerListWin);
}

describe('layerlist/LayerListWin.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(LayerListWin).to.not.be.an('undefined');
  });

  beforeEach(() => {
    comp = createWrapper();
    vm = comp.vm;
  });

  it('has correct default props', () => {
    expect(vm.icon).to.equal('md:layers');
    expect(vm.showLegends).to.be.true;
    expect(vm.showOpacityControls).to.be.true;
  });

  it('does not render on startup', () => {
    expect(comp.text()).to.be.empty;
  });

  afterEach(() => {
    comp.unmount();
  });
});
