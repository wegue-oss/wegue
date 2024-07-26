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
    expect(typeof AppFooter).to.not.equal('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.showCopyrightYear).to.equal(true);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
