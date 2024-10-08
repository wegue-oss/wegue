import { shallowMount } from '@vue/test-utils';
import ModuleCard from '@/components/modulecore/ModuleCard';

const moduleProps = {
  moduleName: 'my-module',
  icon: 'my-icon',
  win: 'floating'
}

function createWrapper (props = moduleProps) {
  return shallowMount(ModuleCard, {
    props
  });
}

describe('modulecore/ModuleCard.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(ModuleCard).to.not.be.an('undefined');
  });

  it('has a created hook', () => {
    expect(ModuleCard.created).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.minimizable).to.equal(false);
      expect(vm.closable).to.equal(true);
      expect(vm.backgroundImage).to.be.undefined;
      expect(vm.draggable).to.equal(true);
      expect(vm.visible).to.equal(false);
      expect(vm.initPos).to.be.an('undefined');
      expect(vm.height).to.be.an('undefined');
      expect(vm.width).to.be.an('undefined');
      expect(vm.maxHeight).to.be.an('undefined');
      expect(vm.maxWidth).to.be.an('undefined');
      expect(vm.minHeight).to.be.an('undefined');
      expect(vm.minWidth).to.be.an('undefined');
    });

    it('has correct props', () => {
      expect(vm.moduleName).to.equal('my-module');
      expect(vm.icon).to.equal('my-icon');
      expect(vm.win).to.equal('floating');
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
      expect(vm.show).to.equal(false);
      expect(vm.minimized).to.equal(false);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('toggleUi switches show', () => {
      vm.show = false;
      vm.toggleUi();
      expect(vm.show).to.equal(true);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
