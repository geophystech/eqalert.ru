import { shallowMount } from '@vue/test-utils'
import StaticPage from '@/components/StaticPage'
import $moment from 'moment'
import $http from 'axios'

describe('StaticPage.vue', () => {

  const $router = {
    currentRoute: {
      params: {
        page: 'about'
      }
    }
  }

  const wrapper = shallowMount(StaticPage, {
    mocks: {
      $http, $moment, $router
    }
  })

  it('Check component StaticPage', () => {
    expect(wrapper.is(StaticPage)).to.eql(true)
  })

})
