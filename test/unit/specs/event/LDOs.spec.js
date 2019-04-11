import { shallowMount } from '@vue/test-utils'
import LDOs from '@/components/event/LDOs'
import $moment from 'moment'
import $http from 'axios'

describe('event/LDOs.vue', () => {

  const wrapper = shallowMount(LDOs, {
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    },
    mocks: {
      $http, $moment
    }
  })

  it('Check component LDOs', () => {
    expect(wrapper.is(LDOs)).to.eql(true)
  })

})
