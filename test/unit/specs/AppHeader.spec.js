import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import AppHeader from '@/components/AppHeader'

describe('AppHeader.vue', () => {
  it('renders logo', () => {
    const Constructor = Vue.extend(AppHeader)
    const vm = new Constructor({router, store}).$mount()

    const logoContainer = vm.$el.querySelector('#logo')
    const logoLink = logoContainer.querySelector('a')
    const logoImage = logoLink.querySelector('img')

    expect(logoContainer.classList.contains('mr-auto')).to.equal(true)

    expect(logoLink.getAttribute('alt')).to.equal('eqalert.ru')
    expect(logoLink.getAttribute('href')).to.equal('#/')

    expect(logoImage.getAttribute('alt')).to.equal('EQA!ert')
    expect(logoImage.getAttribute('src')).to.not.be.empty
  })
})
