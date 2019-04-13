import { shallowMount, createLocalVue } from '@vue/test-utils'
import { $routerMocks, RouterLink } from '../utils'
import EventHeader from '@/components/event/Header'
import BootstrapVue from 'bootstrap-vue'
import Event from '@/components/Event'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

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
    stubs: { RouterLink },
    propsData: {
      components: {
        header: EventHeader
      }
    },
    localVue
  })

  it('Check component Event', () => {
    expect(wrapper.is(Event)).to.eql(true)
  })

})
