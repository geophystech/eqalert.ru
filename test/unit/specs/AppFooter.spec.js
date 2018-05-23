import { shallowMount } from '@vue/test-utils'
import AppFooter from '@/components/AppFooter'

describe('AppFooter.vue', () => {
  const wrapper = shallowMount(AppFooter)

  it('renders copyright', () => {
    const copyright = wrapper.find('#copyright').text()

    expect(copyright).to.equal(`© 2016 — ${(new Date()).getFullYear()} Eqalert.ru`)
  })

  it('renders links', () => {
    const feedbackLink = wrapper.find('#feedback').find('a')
    const geophystechWebsiteLink = wrapper.find('#geophystech-website').find('a')
    const telegramLink = wrapper.find('#social-media-links').findAll('a').at(0)

    expect(feedbackLink.attributes().href).to.equal('https://goo.gl/forms/i48vp55kTjL2d9Wk1')
    expect(feedbackLink.text()).to.equal('Обратная связь')

    expect(geophystechWebsiteLink.attributes().href).to.equal('https://geophystech.ru/')
    expect(geophystechWebsiteLink.text()).to.equal('ООО "Геофизические технологии"')

    expect(telegramLink.attributes().href).to.equal('https://telegram.me/eqalert_ru_bot')
    expect(telegramLink.find('i').classes()).to.contain('fa-telegram')
  })
})
