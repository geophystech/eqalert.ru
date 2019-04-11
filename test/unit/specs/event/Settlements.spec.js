import { shallowMount } from '@vue/test-utils'
import Settlements from '@/components/event/Settlements'
import $moment from 'moment'
import $http from 'axios'

describe('event/Settlements.vue', () => {

  const wrapper = shallowMount(Settlements, {
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    },
    mocks: {
      $http, $moment
    }
  })

  it('Check component Settlements', () => {
    expect(wrapper.is(Settlements)).to.eql(true)
  })

})
