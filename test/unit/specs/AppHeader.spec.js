import { mount, createLocalVue } from '@vue/test-utils'
import AppHeader from '@/components/AppHeader'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import { RouterLink } from '../utils'

const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(BootstrapVue)
localVue.use(VueRouter)

function createWrapper($store)
{
  return mount(AppHeader, {
    stubs: { RouterLink },
    mocks: { $store },
    localVue,
    router
  })
}

describe('AppHeader.vue', () => {

  describe('static elements', () => {

    const wrapper = createWrapper({
      getters: {
        user: {
          authenticated: false
        }
      }
    })

    it('renders logo', () => {
      const logoContainer = wrapper.find('#logo')
      const logoLink = logoContainer.find(RouterLink)
      const logoImage = logoLink.find('img')

      expect(logoLink.props().to).to.equal('/')

      expect(logoImage.attributes().alt).to.equal('EQA!ert')
      expect(!!logoImage.attributes().src).to.equal(true)
    })

    it('renders links', () => {

      const DYFILinkContainer = wrapper.find('.did-you-feel-it')
      expect(DYFILinkContainer.classes()).to.contain('text-center')

      const DYFILink = DYFILinkContainer.find(RouterLink)

      it('renders correct link', () => {
        expect(DYFILink.props().to.name).to.equal('FeltReportPoll')
        expect(DYFILink.text()).to.equal('Ощутили землетрясение?')
      })

    })

  })

  describe('dynamic elements', () => {

    describe('events count', () => {

      const wrapper = createWrapper({
        getters: {
          totalEventsCount: 100500,
          user: {
            authenticated: false
          }
        }
      })

      it('renders events count', () => {
        const count = wrapper.find('#events-count').findAll('span').at(2)

        expect(count.text()).to.equal('100500')
      })
    })

    describe('user authentication block', () => {

      const wrapper = createWrapper({
        getters: {
          user: {
            authenticated: false
          }
        }
      })

      describe('when not authenticated', () => {

        const signInOutContainer = wrapper.find('.sign-in-out')
        const icon = signInOutContainer.find('i')
        const link = signInOutContainer.find(RouterLink)

        it('renders correct link', () => {
          expect(link.props().to.name).to.equal('UserAuthentication')
          expect(link.text()).to.equal('Войти')

          expect(icon.classes()).to.contain('fa')
          expect(icon.classes()).to.contain('fa-long-arrow-right')
          expect(icon.classes()).to.contain('align-middle')
        })
      })

      describe('when authenticated', () => {

        const wrapper = createWrapper({
          getters: {
            user: {
              authenticated: true
            }
          }
        })

        const signInOutContainer = wrapper.find('.sign-in-out')
        const icon = signInOutContainer.find('i')
        const link = signInOutContainer.find('a')

        it('renders correct link', () => {
          expect(link.attributes().href).to.equal('#')
          expect(link.text()).to.equal('Выйти')

          expect(icon.classes()).to.contain('fa')
          expect(icon.classes()).to.contain('fa-times')
          expect(icon.classes()).to.not.contain('align-middle')
        })
      })
    })
  })
})
