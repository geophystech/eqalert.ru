import router from '@/router'
import { shallowMount } from '@vue/test-utils'

import AppHeader from '@/components/AppHeader'

describe('AppHeader.vue', () => {
  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const wrapper = shallowMount(AppHeader, {
    router,
    mocks: {
      $store
    }
  })

  describe('static elements', () => {
    it('renders logo', () => {
      const logoContainer = wrapper.find('#logo')
      const logoLink = logoContainer.find('a')
      const logoImage = logoLink.find('img')

      expect(logoLink.attributes().alt).to.equal('eqalert.ru')
      expect(logoLink.attributes().href).to.equal('#/')

      expect(logoImage.attributes().alt).to.equal('EQA!ert')
      expect(logoImage.attributes().src).to.not.be.empty
    })

    it('renders links', () => {
      const DYFILinkContainer = wrapper.find('.did-you-feel-it')
      const DYFILink = DYFILinkContainer.find('a')
      const socialMediaLinksContainer = wrapper.find('.social-media-links')
      const socialMediaLinks = socialMediaLinksContainer.findAll('a')
      const telegramLink = socialMediaLinks.at(0)

      expect(DYFILinkContainer.classes()).to.contain('text-center')

      expect(DYFILink.attributes().href).to.equal('https://goo.gl/forms/Hd4E0BcA2ffRNjfY2')
      expect(DYFILink.attributes().target).to.equal('_blank')
      expect(DYFILink.text()).to.equal('Ощутили землетрясение?')

      expect(socialMediaLinksContainer.classes()).to.contain('text-md-center')

      expect(socialMediaLinks.length).to.equal(1)
      expect(telegramLink.attributes().href).to.equal('https://telegram.me/eqalert_ru_bot')
    })
  })

  describe('dynamic elements', () => {
    describe('events count', () => {
      const $store = {
        getters: {
          totalEventsCount: 100500,
          user: {
            authenticated: false
          }
        }
      }

      const wrapper = shallowMount(AppHeader, {
        router,
        mocks: {
          $store
        }
      })

      it('renders events count', () => {
        const count = wrapper.find('#events-count').findAll('span').at(2)

        expect(count.text()).to.equal('100500')
      })
    })

    describe('user authentication block', () => {
      describe('when not authenticated', () => {
        const signInOutContainer = wrapper.find('.sign-in-out')
        const icon = signInOutContainer.find('i')
        const link = signInOutContainer.find('a')

        it('renders correct link', () => {
          expect(link.attributes().href).to.equal('#/sign-in')
          expect(link.text()).to.equal('Войти')

          expect(icon.classes()).to.contain('fa')
          expect(icon.classes()).to.contain('fa-long-arrow-right')
          expect(icon.classes()).to.contain('align-middle')
        })
      })

      describe('when authenticated', () => {
        const $store = {
          getters: {
            user: {
              authenticated: true
            }
          }
        }

        const wrapper = shallowMount(AppHeader, {
          router,
          mocks: {
            $store
          }
        })

        const signInOutContainer = wrapper.find('.sign-in-out')
        const icon = signInOutContainer.find('i')
        const link = signInOutContainer.find('a')

        it('renders correct link', () => {
          expect(link.attributes().href).to.equal('javascript:void(0)')
          expect(link.text()).to.equal('Выйти')

          expect(icon.classes()).to.contain('fa')
          expect(icon.classes()).to.contain('fa-times')
          expect(icon.classes()).to.not.contain('align-middle')
        })
      })
    })
  })
})
