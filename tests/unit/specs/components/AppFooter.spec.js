import { shallowMount } from '@vue/test-utils';
import AppFooter from 'APP/components/AppFooter';

const footerProps = {
  footerTextLeft: 'my-text-left',
  footerTextRight: 'my-text-right'
};

function createWrapper (props = footerProps) {
  return shallowMount(AppFooter, {
    props
  });
}

describe('AppFooter.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(AppFooter).to.not.be.an('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.showCopyrightYear).to.be.true;
    });

    it('has correct props', () => {
      expect(vm.footerTextLeft).to.equal('my-text-left');
      expect(vm.footerTextRight).to.equal('my-text-right');
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
