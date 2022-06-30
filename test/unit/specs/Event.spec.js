import { mount, createLocalVue } from '@vue/test-utils'
import {$routerMocks, EVENT_BUIDINGS, EVENT_DATA, EVENT_LDOS, RouterLink} from '../utils'
import EventHeader from '@/components/event/Header'
import BootstrapVue from 'bootstrap-vue'
import Event from '@/components/Event'
import $moment from 'moment'
import flushPromises from 'flush-promises'
import apiSettings from '@/settings/api'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http, authenticated)
{
  const $store = {
    getters: {
      user: {
        authenticated: authenticated
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

const respData = (data) => {
  return {
    data: {
      data: data
    }
  }
}

describe('Event.vue', () => {

  describe('Request Event', () => {

    ([

      ['Response Success if user authenticated', resp => Promise.resolve(resp), wrapper => {

        wrapper.vm.$store.getters.user.authenticated = true

        flushPromises().then(() => {
          expect(wrapper.vm.event.id).to.eql(EVENT_DATA.id)
        })

      }, true],

      ['Response Success if not user authenticated', resp => Promise.resolve(resp), wrapper => {
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
      }],

      ['Magnitude Types', resp => Promise.resolve(resp), wrapper => {

        const magnitudeTypes = {
          'L': [['M', 'L']],
          'b': [['m', 'b']],
          'B': [['m', 'B']],
          's': [['M', 's']],
          'S': [['M', 'S']],
          'W': [['M', 'W']],
          'G': [['M', 'b'], ['L', 'g']],
          'C': [['M', 'c']],
          'mww': [['M', 'mww']],
          '': [['M', '']]
        }

        for (let [k, v] of Object.entries(magnitudeTypes)) {
          expect(wrapper.vm.magnitudeType(k)).to.eql(v)
        }

      }]

    ]).forEach(conf => {

      const [label, httpResp, callBack, authenticated] = conf

      const wrapper = createWrapper({
        get: (url) => {
          switch(url) {
            case (apiSettings.endpointEventBuildings(EVENT_DATA.id)):
              return httpResp(respData(EVENT_BUIDINGS))
            case(apiSettings.endpointEventLDOs(EVENT_DATA.id)):
              return httpResp(respData(EVENT_LDOS))
            default:
              return httpResp(respData(EVENT_DATA))
          }
        }
      }, !!authenticated)

      it(label, async() => {
        callBack(wrapper)
      })

      wrapper.destroy()

    })

  })

})
