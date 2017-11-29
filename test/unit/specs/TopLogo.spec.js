import Vue from 'vue'
import TopLogo from '@/components/TopLogo'

describe('TopLogo.vue', () => {
  it('should render an <img> tag', () => {
    const Constructor = Vue.extend(TopLogo);
    const TopLogoComponent = new Constructor({
      logoSrc: 'foosrc'
    }).$mount();

    // assert that component has an img tag
    const avatarImg = TopLogoComponent.$el.querySelector('img');
    expect(avatarImg.src !== null).to.equal(true);
  })
})
