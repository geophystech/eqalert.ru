import Vue from 'vue'
import Mainpage from '@/components/Mainpage'

describe('Mainpage.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Mainpage)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.mainpage h4').textContent)
      .to.equal('Тензор момента')
  })
})
