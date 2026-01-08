import { shallowMount } from '@vue/test-utils';
import AppHeader from 'APP/components/AppHeader.vue';

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
    it('getModuleButtons(\'menu\') returns correct data', () => {
      // mock a module conf
      const appConfig = {
        modules: {
          'wgu-infoclick': {
            target: 'menu'
          }
        }
      };
      comp = createWrapper(appConfig);
      vm = comp.vm;

      const moduleData = vm.getModuleButtons('menu');
      expect(moduleData).to.be.an('array').that.has.lengthOf(1);
      expect(moduleData[0].type).to.equal('wgu-infoclick-btn');
      expect(moduleData[0].target).to.equal('menu');
    });

    it('getModuleButtons(\'toolbar\') returns correct data', () => {
      // mock a module conf
      const appConfig = {
        modules: {
          'wgu-zoomtomaxextent': {
            target: 'toolbar'
          }
        }
      };
      comp = createWrapper(appConfig);
      vm = comp.vm;

      const moduleData = vm.getModuleButtons('toolbar');
      expect(moduleData).to.be.an('array').that.has.lengthOf(1);
      expect(moduleData[0].type).to.equal('wgu-zoomtomaxextent-btn');
      expect(moduleData[0].target).to.equal('toolbar');
    });

    it('getModuleButtons supports multiple button instances', () => {
      // mock a module conf
      const appConfig = {
        modules: {
          'wgu-helpwin1': {
            moduleType: 'wgu-helpwin',
            target: 'toolbar'
          },
          'wgu-helpwin2': {
            moduleType: 'wgu-helpwin',
            target: 'toolbar'
          }
        }
      };
      comp = createWrapper(appConfig);
      vm = comp.vm;

      const moduleData = vm.getModuleButtons('toolbar');
      expect(moduleData).to.be.an('array');
      expect(moduleData.length).to.equal(2);
      expect(moduleData[0].type).to.equal('wgu-helpwin-btn');
      expect(moduleData[0].target).to.equal('toolbar');
      expect(moduleData[1].type).to.equal('wgu-helpwin-btn');
      expect(moduleData[1].target).to.equal('toolbar');
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
