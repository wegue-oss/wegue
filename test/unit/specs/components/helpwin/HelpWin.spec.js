import { shallowMount } from '@vue/test-utils';
import HelpWin from '@/components/helpwin/HelpWin'
import Vue from 'vue';

describe('helpwin/HelpWin.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof HelpWin).to.not.equal('undefined');
  });

  describe('unconfigured', () => {
    let comp;
    beforeEach(() => {
      Vue.prototype.$appConfig = {modules: {}};
      comp = shallowMount(HelpWin);
    });

    it('has correct default props', () => {
      expect(comp.vm.color).to.equal('red darken-3');
      expect(comp.vm.icon).to.equal('help');
      expect(comp.vm.windowTitle).to.equal('About');
      expect(comp.vm.textTitle).to.equal('About Wegue');
      expect(comp.vm.htmlContent).to.equal('<h3>WebGIS with OpenLayers and Vue.js</h3>');
      expect(comp.vm.infoLinkUrl).to.equal('https://github.com/meggsimum/wegue');
      expect(comp.vm.infoLinkText).to.equal('More info');
    });
  });

  describe('configured', () => {
    let comp;
    beforeEach(() => {
      // Config is fetched on 'mount' so need to defined before.
      Vue.prototype.$appConfig = {
        modules: {
          'wgu-helpwin': {
            'windowTitle': 'My Window Title',
            'htmlContent': '<h1>MY CONTENT</h1>',
            'infoLinkUrl': 'https://wegue.org',
            'infoLinkText': 'Some Info Link Text'
          }
        }
      };
      comp = shallowMount(HelpWin);
    });

    it('has correct configured and default props', () => {
      expect(comp.vm.color).to.equal('red darken-3');
      expect(comp.vm.icon).to.equal('help');
      expect(comp.vm.windowTitle).to.equal('My Window Title');
      expect(comp.vm.textTitle).to.equal('About Wegue');
      expect(comp.vm.htmlContent).to.equal('<h1>MY CONTENT</h1>');
      expect(comp.vm.infoLinkUrl).to.equal('https://wegue.org');
      expect(comp.vm.infoLinkText).to.equal('Some Info Link Text');
    });
  });

  describe('data', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(HelpWin);
    });

    it('has correct default data', () => {
      expect(comp.vm.show).to.equal(false);
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(HelpWin);
      vm = comp.vm;
    });

    it('onWinXClose switches show', () => {
      // mock a window UI instance
      let cnt = 0;
      vm.$on('winxclose', () => {
        cnt++;
      });
      vm.onWinXClose();
      expect(cnt).to.equal(1);
    });
  });
});
