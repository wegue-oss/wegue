import { shallowMount } from '@vue/test-utils';
import ModuleCard from '@/components/modulecore/ModuleCard.vue';

const moduleProps = {
  moduleName: 'my-module',
  icon: 'my-icon'
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

  it('has an updated hook', () => {
    expect(ModuleCard.updated).to.be.a('function');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.win).to.equal('floating');
      expect(vm.minimizable).to.be.false;
      expect(vm.closable).to.be.true;
      expect(vm.backgroundImage).to.be.undefined;
      expect(vm.visible).to.be.false;
      expect(vm.draggable).to.be.true;
      expect(vm.initPos).to.be.undefined;
      expect(vm.height).to.be.undefined;
      expect(vm.width).to.be.undefined;
      expect(vm.maxHeight).to.be.undefined;
      expect(vm.maxWidth).to.be.undefined;
      expect(vm.minHeight).to.be.undefined;
      expect(vm.minWidth).to.be.undefined;
    });

    it('has correct props', () => {
      expect(vm.moduleName).to.equal('my-module');
      expect(vm.icon).to.equal('my-icon');
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
      expect(vm.show).to.be.false;
      expect(vm.minimized).to.be.false;
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

      expect(vm.show).to.be.true;
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
