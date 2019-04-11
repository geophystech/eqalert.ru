import { shallowMount } from '@vue/test-utils'
import MobileAppAlert from '@/components/MobileAppAlert'
import $moment from 'moment'
import $http from 'axios'

describe('MobileAppAlert.vue', () => {

  const wrapper = shallowMount(MobileAppAlert, {
    mocks: {
      $http, $moment
    }
  })

  it('Check component MobileAppAlert', () => {
    expect(wrapper.is(MobileAppAlert)).to.eql(true)
  })

})
