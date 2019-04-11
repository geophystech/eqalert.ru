import { shallowMount } from '@vue/test-utils'
import LastEvents from '@/components/event/LastEvents'
import $moment from 'moment'
import $http from 'axios'

describe('event/LastEvents.vue', () => {

  const $route = {
    query: {}
  }

  const wrapper = shallowMount(LastEvents, {
    mocks: {
      $http, $moment, $route
    }
  })

  it('Check component LastEvents', () => {
    expect(wrapper.is(LastEvents)).to.eql(true)
  })

})
