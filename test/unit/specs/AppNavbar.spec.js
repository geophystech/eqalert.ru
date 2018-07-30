import router from '@/router'
import { shallowMount } from '@vue/test-utils'
import AppNavbar from '@/components/AppNavbar'

describe('AppNavbar.vue', () => {
  const wrapper = shallowMount(AppNavbar, {
    router
  })

  it('renders links', () => {
    const internalLinks = wrapper.findAll('b-nav-item')
    const externalLinks = wrapper.findAll('a')

    const eventsLink = internalLinks.at(0)
    const analyticsLink = internalLinks.at(1)
    const aboutServiceLink = internalLinks.at(2)
    const seismicMonitoringLink = externalLinks.at(0)

    expect(internalLinks.length).to.equal(3)
    expect(externalLinks.length).to.equal(1)

    expect(eventsLink.text()).to.equal('Все землетрясения')
    expect(analyticsLink.text()).to.equal('Аналитика')
    expect(aboutServiceLink.text()).to.equal('О проекте')

    expect(seismicMonitoringLink.text()).to.equal('Мониторинг объектов')
    expect(seismicMonitoringLink.attributes().href).to.equal('https://geophystech.ru/services/seismic-monitoring-system/')
  })
})
