import { shallowMount, createLocalVue } from '@vue/test-utils'
import AppFooter from '@/components/AppFooter'
import BootstrapVue from 'bootstrap-vue'
import AppSettings from '@/settings/app'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('AppFooter.vue', () => {

  const wrapper = shallowMount(AppFooter, {
    localVue
  })

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
