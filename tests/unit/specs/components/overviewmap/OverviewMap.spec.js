import { mount, shallowMount } from '@vue/test-utils';
import OverviewMap from '@/components/overviewmap/OverviewMap';

function createWrapper (stubChildrenComponents = true) {
  if (stubChildrenComponents) {
    return shallowMount(OverviewMap);
  } else {
    return mount(OverviewMap);
  }
}

describe('overviewmap/OverviewMap.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(OverviewMap).to.not.be.an('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('md:zoom_out_map');
      expect(vm.visible).to.equal(true);
      expect(vm.rotateWithView).to.equal(true);
      expect(vm.width).to.equal(164);
      expect(vm.height).to.equal(178);
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
      expect(vm.open).to.equal(true);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('user interactions', () => {
    // Remarks: The following is necessary to avoid warnings.
    //  For reasons not fully understood the test utils will fail to attach
    //  the v-menu to the wgu-overviewmap-wrapper div element created
    //  in the component.
    const div = document.createElement('div');
    div.id = 'wgu-overviewmap-wrapper';
    document.body.appendChild(div);

    beforeEach(() => {
      comp = createWrapper(false);
      vm = comp.vm;
    });

    it('button click switches open', async () => {
      expect(vm.open).to.equal(true);

      const button = comp.findComponent({ name: 'v-btn' });
      await button.trigger('click');

      expect(vm.open).to.equal(false);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
