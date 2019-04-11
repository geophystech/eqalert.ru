import { shallowMount } from '@vue/test-utils'
import Events from '@/components/Events'
import $moment from 'moment'
import $http from 'axios'

describe('Events.vue', () => {

  const wrapper = shallowMount(Events, {
    propsData: {
      spinners: {},
      events: []
    },
    mocks: {
      $http, $moment
    }
  })

  it('Check component Events', () => {
    expect(wrapper.is(Events)).to.eql(true)
  })

})
