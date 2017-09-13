import Vue from 'vue'
import Mainpage from '@/components/Mainpage'

describe('Mainpage.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Mainpage)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
  })
})
