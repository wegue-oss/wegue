import Vue from 'vue'
import AppLogo from '@/components/AppLogo'

describe('AppLogo.vue', () => {
  it('should render an <img> tag', () => {
    const Constructor = Vue.extend(AppLogo);
    const AppLogoComponent = new Constructor({
      logoSrc: 'foosrc'
    }).$mount();

    // assert that component has an img tag
    const avatarImg = AppLogoComponent.$el.querySelector('img');
    expect(avatarImg.src !== null).to.equal(true);
  });
});
