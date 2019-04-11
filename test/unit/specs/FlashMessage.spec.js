import { shallowMount } from '@vue/test-utils'
import FlashMessage from '@/components/FlashMessage'
import $moment from 'moment'
import $http from 'axios'

describe('FlashMessage.vue', () => {

  const wrapper = shallowMount(FlashMessage, {
    mocks: { $http, $moment }
  })

  it('Check component FlashMessage', () => {
    expect(wrapper.is(FlashMessage)).to.eql(true)
  })

})
