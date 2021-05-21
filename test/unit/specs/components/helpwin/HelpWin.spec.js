import { shallowMount } from '@vue/test-utils';
import HelpWin from '@/components/helpwin/HelpWin'
import Vue from 'vue';

const moduleProps = {
  'title': 'My Window Title',
  'htmlContent': '<h1>MY CONTENT</h1>',
  'infoLinkUrl': 'https://wegue.org',
  'infoLinkText': 'Some Info Link Text'
};

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
      expect(comp.vm.icon).to.equal('help');
      expect(comp.vm.title).to.equal('About');
      expect(comp.vm.textTitle).to.equal('About Wegue');
      expect(comp.vm.htmlContent).to.equal('<h3>WebGIS with OpenLayers and Vue.js</h3>');
      expect(comp.vm.infoLinkUrl).to.equal('https://github.com/meggsimum/wegue');
      expect(comp.vm.infoLinkText).to.equal('More info');
    });
  });

  describe('configured', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(HelpWin, {
        propsData: moduleProps
      });
    });

    it('has correct configured and default props', () => {
      expect(comp.vm.icon).to.equal('help');
      expect(comp.vm.title).to.equal('My Window Title');
      expect(comp.vm.textTitle).to.equal('About Wegue');
      expect(comp.vm.htmlContent).to.equal('<h1>MY CONTENT</h1>');
      expect(comp.vm.infoLinkUrl).to.equal('https://wegue.org');
      expect(comp.vm.infoLinkText).to.equal('Some Info Link Text');
    });
  });
});
