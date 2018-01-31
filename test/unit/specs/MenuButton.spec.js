import Vue from 'vue'
import MenuButton from '@/components/MenuButton'

describe('MenuButton.vue', () => {
  // Inspect the raw component options
  it('has a props object', () => {
    expect(typeof MenuButton.props).to.equal('object');
    expect(typeof MenuButton.props.icon).to.equal('object');
    expect(typeof MenuButton.props.text).to.equal('object');
  });

  // Mount an instance and inspect the render output
  it('renders the right sub-component', () => {
    const Constructor = Vue.extend(MenuButton);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('v-btn') !== null).to.equal(true);
  });

  it('has a method onClick', () => {
    const Constructor = Vue.extend(MenuButton);
    const vm = new Constructor().$mount();
    expect(typeof vm.onClick).to.equal('function');
  });
});
