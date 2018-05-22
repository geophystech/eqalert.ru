import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import AppHeader from '@/components/AppHeader'

describe('AppHeader.vue', () => {
  const Constructor = Vue.extend(AppHeader)
  const vm = new Constructor({ router, store }).$mount()

  it('renders logo', () => {
    const logoContainer = vm.$el.querySelector('#logo')
    const logoLink = logoContainer.querySelector('a')
    const logoImage = logoLink.querySelector('img')

    expect(logoContainer.classList.contains('mr-auto')).to.equal(true)

    expect(logoLink.getAttribute('alt')).to.equal('eqalert.ru')
    expect(logoLink.getAttribute('href')).to.equal('#/')

    expect(logoImage.getAttribute('alt')).to.equal('EQA!ert')
    expect(logoImage.getAttribute('src')).to.not.be.empty
  })

  it('renders links', () => {
    const DYFILinkContainer = vm.$el.querySelector('.did-you-feel-it')
    const DYFILink = DYFILinkContainer.querySelector('a')
    const pageLinksContainer = vm.$el.querySelector('#page-links')
    const pageLinks = pageLinksContainer.querySelectorAll('a')
    const eventsLink = pageLinks[0]
    const analyticsLink = pageLinks[1]

    expect(DYFILinkContainer.classList.contains('text-center')).to.equal(true)

    expect(DYFILink.getAttribute('href')).to.equal('https://goo.gl/forms/Hd4E0BcA2ffRNjfY2')
    expect(DYFILink.getAttribute('target')).to.equal('_blank')
    expect(DYFILink.textContent.trim()).to.equal('Ощутили землетрясение?')

    expect(pageLinksContainer.classList.contains('mr-auto')).to.equal(true)

    expect(pageLinks.length).to.equal(2)

    expect(eventsLink.getAttribute('href')).to.equal('#/events?hasMt=1')
    expect(eventsLink.textContent).to.equal('Тензор момента')

    expect(analyticsLink.getAttribute('href')).to.equal('#/analytics')
    expect(analyticsLink.textContent).to.equal('Аналитика')
  })
})
