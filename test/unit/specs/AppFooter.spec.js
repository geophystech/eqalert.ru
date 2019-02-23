import { shallowMount } from '@vue/test-utils'
import AppFooter from '@/components/AppFooter'
import AppSettings from '@/settings/app'

describe('AppFooter.vue', () => {

  const wrapper = shallowMount(AppFooter)

  it('renders copyright', () => {
    const copyright = wrapper.find('#copyright').text()

    expect(copyright).to.equal(`© 2016 — ${(new Date()).getFullYear()} Eqalert.ru`)
  })

  it('renders links', () => {
    const feedbackLink = wrapper.find('#feedback').find('a')
    const geophystechWebsiteLink = wrapper.find('#geophystech-website').find('a')

    expect(feedbackLink.attributes().href).to.equal(AppSettings.feedbackUrl)
    expect(feedbackLink.text()).to.equal('Обратная связь')

    expect(geophystechWebsiteLink.attributes().href).to.equal('https://geophystech.ru/contacts')
    expect(geophystechWebsiteLink.text()).to.equal('ООО "Геофизические технологии"')
  })

})
