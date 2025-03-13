import { shallowMount } from '@vue/test-utils';
import AppSidebar from 'APP/components/AppSidebar';
import { WguEventBus } from '@/WguEventBus';

function createWrapper () {
  return shallowMount(AppSidebar);
}

describe('AppSidebar.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(AppSidebar).to.not.be.an('undefined');
  });

  it('has a setup hook', () => {
    expect(AppSidebar.setup).to.be.a('function');
  });

  it('has a created hook', () => {
    expect(AppSidebar.created).to.be.a('function');
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.sidebarOpen).to.be.true;
      expect(vm.sidebarWidth).to.equal(400);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('events', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('event "sidebar-toggle" forces correct open state', () => {
      // force closing sidebar by adding 'false' parameter
      WguEventBus.$emit('sidebar-toggle', false);
      expect(vm.sidebarOpen).to.be.false;
      // toggle sidebar open state by skipping parameter
      WguEventBus.$emit('sidebar-toggle');
      expect(vm.sidebarOpen).to.be.true;
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
