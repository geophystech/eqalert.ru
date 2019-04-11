import { shallowMount } from '@vue/test-utils'
import CountersHeader from '@/components/CountersHeader'
import $moment from 'moment'
import $http from 'axios'

describe('CountersHeader.vue', () => {

  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const wrapper = shallowMount(CountersHeader, {
    mocks: { $http, $moment, $store }
  })

  it('Check component CountersHeader', () => {
    expect(wrapper.is(CountersHeader)).to.eql(true)
  })

})
