import { shallowMount } from '@vue/test-utils';
import AppHeader from 'APP/components/AppHeader';

function createWrapper ($appConfig = {}) {
  return shallowMount(AppHeader, {
    global: {
      mocks: {
        $appConfig
      }
    }
  });
}

describe('AppHeader.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(AppHeader).to.not.be.an('undefined');
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.menuButtons).to.be.an('array').that.is.empty;
      expect(vm.tbButtons).to.be.an('array').that.is.empty;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('methods', () => {
    const appConfig = {
      modules: {
        'wgu-infoclick': {
          target: 'menu'
        },
        'wgu-zoomtomaxextent': {
          target: 'toolbar'
        }
      }
    };

    beforeEach(() => {
      comp = createWrapper(appConfig);
      vm = comp.vm;
    });

    it('getModuleButtons(\'menu\') returns always an array', () => {
      const moduleData = vm.getModuleButtons('menu');
      expect(moduleData).to.be.an('array');
    });

    it('getModuleButtons(\'menu\') returns correct data', () => {
      const moduleData = vm.getModuleButtons('menu');
      expect(moduleData).to.be.an('array').that.has.lengthOf(1);
      expect(moduleData[0].type).to.equal('wgu-infoclick-btn');
      expect(moduleData[0].target).to.equal('menu');
    });

    it('getModuleButtons(\'toolbar\') returns always an array', () => {
      const moduleData = vm.getModuleButtons('toolbar');
      expect(moduleData).to.be.an('array');
    });

    it('getModuleButtons(\'toolbar\') returns correct data', () => {
      const moduleData = vm.getModuleButtons('toolbar');
      expect(moduleData).to.be.an('array').that.has.lengthOf(1);
      expect(moduleData[0].type).to.equal('wgu-zoomtomaxextent-btn');
      expect(moduleData[0].target).to.equal('toolbar');
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
