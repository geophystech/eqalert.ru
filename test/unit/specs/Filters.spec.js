import { shallowMount } from '@vue/test-utils'
import Filters from '@/components/Filters'
import { $routerMocks } from '../utils'
import $moment from 'moment'
import $http from 'axios'

describe('Filters.vue', () => {

  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const wrapper = shallowMount(Filters, {
    mocks: Object.assign({ $http, $moment, $store }, $routerMocks)
  })

  it('Check component Filters', () => {
    expect(wrapper.is(Filters)).to.eql(true)
  })

})
