import { shallowMount } from '@vue/test-utils'
import Event from '@/components/Event'
import EventHeader from '@/components/event/Header'
import $moment from 'moment'
import $http from 'axios'
import {$routerMocks} from '../utils'

describe('Event.vue', () => {

  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const wrapper = shallowMount(Event, {
    mocks: Object.assign({ $http, $moment, $store }, $routerMocks),
    propsData: {
      components: {
        header: EventHeader
      }
    }
  })

  it('Check component Event', () => {
    expect(wrapper.is(Event)).to.eql(true)
  })

})
