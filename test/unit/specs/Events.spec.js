import { mount, createLocalVue } from '@vue/test-utils'
import {$routerMocks, deepClone, EVENT_DATA, RouterLink, UID} from '../utils'
import flushPromises from 'flush-promises'
import Events from '@/components/Events'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import Vue from 'vue'

Vue.filter('moment', (d, f) => $moment(d).format(f))
const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http, additionaMocks = {})
{
  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const mocks = Object.assign({ $http, $moment, $store }, $routerMocks)

  Object.keys(additionaMocks).forEach(k => {
    mocks[k] = additionaMocks[k]
  })

  return mount(Events, {
    mocks: Object.assign({ $http, $moment, $store }, $routerMocks),
    stubs: {
      RouterLink,
      Filters: {
        name: 'Filters',
        render: function(createElement) {
          return createElement('div', this.$slots.default)
        },
        props: [],
        methods: {
          setErrors: function(errors)
          {

          }
        }
      }
    },
    propsData: {
      spinners: {},
      events: []
    },
    localVue
  })
}

const resp = (empty) => {
  return {
    data: {
      data: empty ? [] : Array.from({length: 10}).map(it => {
        it = deepClone(EVENT_DATA)
        it.id = UID(10)
        return it
      })
    }
  }
}

describe('Events.vue', () => {

  it('Event list rendered', async () => {

    let wrapper = createWrapper({
      get: () => Promise.resolve(resp())
    })

    flushPromises().then(() => {
      expect(wrapper.findAll('.events-row').length).to.equal(resp.data.data.length)
    })

  })

})
