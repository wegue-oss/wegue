import { shallowMount } from '@vue/test-utils';
import HelpWin from '@/components/helpwin/HelpWin'

describe('helpwin/HelpWin.vue', () => {
  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof HelpWin).to.not.equal('undefined');
  });

  describe('props', () => {
    let comp;
    beforeEach(() => {
      comp = shallowMount(HelpWin);
    });

    it('has correct default props', () => {
      expect(comp.vm.color).to.equal('red darken-3');
      expect(comp.vm.icon).to.equal('help');
      expect(comp.vm.title).to.equal('About');
      expect(comp.vm.headline).to.equal('About Wegue');
      expect(comp.vm.content).to.equal('<h3>WebGIS with OpenLayers and Vue.js</h3> Template and re-usable components for webmapping applications with OpenLayers and Vue.js');
      expect(comp.vm.infoLink).to.equal('https://github.com/meggsimum/wegue');
      expect(comp.vm.infoLinkText).to.equal('More info');
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
