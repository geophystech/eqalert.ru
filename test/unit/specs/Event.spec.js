import { mount, createLocalVue } from '@vue/test-utils'
import {$routerMocks, EVENT_DATA, RouterLink} from '../utils'
import EventHeader from '@/components/event/Header'
import BootstrapVue from 'bootstrap-vue'
import Event from '@/components/Event'
import $moment from 'moment'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  return mount(Event, {
    mocks: Object.assign({ $http, $moment, $store }, $routerMocks),
    stubs: { RouterLink },
    propsData: {
      components: {
        header: EventHeader
      }
    },
    localVue
  })
}

const resp = {
  data: {
    data: EVENT_DATA
  }
}

describe('Event.vue', () => {

  describe('Request Event', () => {

    ([

      ['Response Success if user authenticated', () => Promise.resolve(resp), wrapper => {

        wrapper.vm.$store.getters.user.authenticated = true

        flushPromises().then(() => {
          expect(wrapper.vm.event.id).to.eql(EVENT_DATA.id)
        })

      }],

      ['Response Success if not user authenticated', () => Promise.resolve(resp), wrapper => {
        flushPromises().then(() => {
          expect(wrapper.vm.event.id).to.eql(EVENT_DATA.id)
        })
      }],

      ['Response Error', () => Promise.reject({
        response: {
          statusText: '',
          status: 403
        }
      }), wrapper => {
        flushPromises().then(() => {
          expect(wrapper.vm.errorResponse.status).to.eql(403)
        })
      }]

    ]).forEach(conf => {

      const [label, httpResp, callBack] = conf

      const wrapper = createWrapper({
        get: httpResp
      })

      it(label, async () => {
        callBack(wrapper)
      })

      wrapper.destroy()

    })

  })

})
