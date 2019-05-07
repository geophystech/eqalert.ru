import { mount, createLocalVue } from '@vue/test-utils'
import {$routerMocks, deepClone, EVENT_DATA, RouterLink, UID} from '../utils'
import flushPromises from 'flush-promises'
import Events from '@/components/Events'
import CountersHeader from '@/components/CountersHeader'
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
      CountersHeader,
      Filters: {
        name: 'Filters',
        render: function(createElement) {
          return createElement('div', this.$slots.default)
        },
        props: [],
        data() {
          return {
            filters: {
              has_training: null
            }
          }
        },
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

const respLength = 10

const resp = (empty) => {
  return {
    data: {
      data: empty ? [] : Array.from({length: respLength}).map(it => {
        it = deepClone(EVENT_DATA)
        it.id = UID(10)
        return it
      })
    }
  }
}

describe('Events.vue', () => {

  it('Event list rendered by filter', async () => {

    let wrapper = createWrapper({
      get: () => Promise.resolve(resp())
    })

    flushPromises().then(() => {
      wrapper.vm.getEvents({})
      expect(wrapper.findAll('.events-row').length).to.equal(respLength)
    })

  })

  it('Event list rendered by empty filter', async () => {

    let wrapper = createWrapper({
      get: () => Promise.resolve(resp())
    })

    flushPromises().then(() => {
      wrapper.vm.getEvents({})
      expect(wrapper.findAll('.events-row').length).to.equal(respLength)
    })

  })

  it('Event list more rendered', async () => {

    let wrapper = createWrapper({
      get: () => Promise.resolve(resp())
    })

    wrapper.setData({
      apiParams: {
        cursor: 'cursor simulate'
      }
    })

    wrapper.find('#loadMoreEventsBtn').trigger('click')

    flushPromises().then(() => {
      wrapper.vm.getEvents({})
      expect(wrapper.findAll('.events-row').length).to.equal(respLength * 2)
    })

  })

  it('Event list empty response', async () => {

    let wrapper = createWrapper({
      get: () => Promise.resolve(resp(true))
    })

    flushPromises().then(() => {
      wrapper.vm.getEvents()
      expect(wrapper.findAll('.events-row').length).to.equal(0)
    })

  })

  it('Show Training Events', async () => {

    let wrapper = createWrapper({
      get: () => Promise.resolve(resp())
    })

    flushPromises().then(() => {
      wrapper.find(CountersHeader).vm.showTrainingEvents = true
      expect(wrapper.vm.$refs.filters.filters.has_training).to.equal(1)
      wrapper.find(CountersHeader).vm.showTrainingEvents = false
      expect(wrapper.vm.$refs.filters.filters.has_training).to.equal(null)
    })

  })

})
