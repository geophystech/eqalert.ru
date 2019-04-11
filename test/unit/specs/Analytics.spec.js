import { shallowMount } from '@vue/test-utils'
import Analytics from '@/components/Analytics'
import $moment from 'moment'
import $http from 'axios'

describe('Analytics.vue', () => {

  const wrapper = shallowMount(Analytics, {
    mocks: {
      $http, $moment
    }
  })

  it('Check component Analytics', () => {
    expect(wrapper.is(Analytics)).to.eql(true)
  })

})
