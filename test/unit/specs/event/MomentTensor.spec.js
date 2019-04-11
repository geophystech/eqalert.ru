import { shallowMount } from '@vue/test-utils'
import MomentTensor from '@/components/event/MomentTensor'
import $moment from 'moment'
import $http from 'axios'

describe('event/MomentTensor.vue', () => {

  const wrapper = shallowMount(MomentTensor, {
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    },
    mocks: {
      $http, $moment
    }
  })

  it('Check component MomentTensor', () => {
    expect(wrapper.is(MomentTensor)).to.eql(true)
  })

})
