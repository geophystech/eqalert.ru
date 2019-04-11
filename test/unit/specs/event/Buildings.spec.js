import { shallowMount } from '@vue/test-utils'
import Buildings from '@/components/event/Buildings'
import $moment from 'moment'
import $http from 'axios'

describe('event/Buildings.vue', () => {

  const wrapper = shallowMount(Buildings, {
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    },
    mocks: {
      $http, $moment
    }
  })

  it('Check component Buildings', () => {
    expect(wrapper.is(Buildings)).to.eql(true)
  })

})
