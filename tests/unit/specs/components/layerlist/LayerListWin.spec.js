import { shallowMount } from '@vue/test-utils';
import LayerListWin from '@/components/layerlist/LayerListWin.vue';

const moduleProps = {
  moduleName: 'wgu-layerlist'
};

function createWrapper (props = moduleProps) {
  return shallowMount(LayerListWin, {
    props
  });
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
