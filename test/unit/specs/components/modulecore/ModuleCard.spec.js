import ModuleCard from '@/components/modulecore/ModuleCard'
import { shallowMount } from '@vue/test-utils';

const moduleProps = {
  moduleName: 'my-module',
  icon: 'my-icon',
  title: 'my-title',
  win: 'floating'
}

describe('modulecore/ModuleCard.vue', () => {
  it('is defined', () => {
    expect(ModuleCard).to.not.be.an('undefined');
  });

  it('has a created hook', () => {
    expect(ModuleCard.created).to.be.a('function');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(ModuleCard, {
        propsData: moduleProps
      });
    });

    it('has correct default props', () => {
      expect(comp.vm.minimizable).to.equal(false);
      expect(comp.vm.color).to.equal('red darken-3');
      expect(comp.vm.backgroundImage).to.be.undefined;
      expect(comp.vm.draggable).to.equal(true);
      expect(comp.vm.visible).to.equal(false);
      expect(comp.vm.initPos).to.be.an('undefined');
      expect(comp.vm.height).to.be.an('undefined');
      expect(comp.vm.width).to.be.an('undefined');
      expect(comp.vm.maxHeight).to.be.an('undefined');
      expect(comp.vm.maxWidth).to.be.an('undefined');
      expect(comp.vm.minHeight).to.be.an('undefined');
      expect(comp.vm.minWidth).to.be.an('undefined');
    });

    it('has correct props', () => {
      expect(comp.vm.moduleName).to.equal('my-module');
      expect(comp.vm.icon).to.equal('my-icon');
      expect(comp.vm.title).to.equal('my-title');
      expect(comp.vm.win).to.equal('floating');
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(ModuleCard, {
        propsData: moduleProps
      });
    });

    it('has correct default data', () => {
      expect(comp.vm.show).to.equal(false);
      expect(comp.vm.minimized).to.equal(false);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('methods', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(ModuleCard, {
        propsData: moduleProps
      });
    });

    it('toggleUi switches show', () => {
      comp.vm.show = false;
      comp.vm.toggleUi();
      expect(comp.vm.show).to.equal(true);
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
