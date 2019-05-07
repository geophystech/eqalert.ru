import { mount, createLocalVue } from '@vue/test-utils'
import {$routerMocks, BS_STUBS, deepClone, EVENT_DATA, RouterLink, UID} from '../utils'
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

  const stubs = Object.assign({
    RouterLink,
    Filters: {
      name: 'Filters',
      template: `
          <div>
            <div class="errors">{{ errors }}</div>
          </div>
        `,
      props: [],
      data() {
        return {
          filters: {
            has_training: null
          },
          errors: ''
        }
      },
      methods: {
        setErrors(errors) {
          this.errors = errors
        },
        send() {

        }
      }
    }
  }, BS_STUBS)

  return mount(Events, {
    propsData: {
      spinners: {},
      events: []
    },
    localVue,
    mocks,
    stubs
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

    const wrapper = createWrapper({
      get: () => Promise.resolve(resp())
    })

    flushPromises().then(() => {
      wrapper.vm.getEvents({})
      expect(wrapper.findAll('.events-row').length).to.equal(respLength)
    })

  })

  it('Event list rendered by empty filter', async () => {

    const wrapper = createWrapper({
      get: () => Promise.resolve(resp())
    })

    flushPromises().then(() => {
      wrapper.vm.getEvents({})
      expect(wrapper.findAll('.events-row').length).to.equal(respLength)
    })

  })

  it('Event list more rendered', async () => {

    const wrapper = createWrapper({
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

    const wrapper = createWrapper({
      get: () => Promise.resolve(resp(true))
    })

    flushPromises().then(() => {
      wrapper.vm.getEvents()
      expect(wrapper.findAll('.events-row').length).to.equal(0)
    })

  })

  it('Show Training Events', async () => {

    const wrapper = createWrapper({
      get: () => Promise.resolve(resp())
    })

    flushPromises().then(() => {
      wrapper.find(CountersHeader).vm.showTrainingEvents = true
      expect(wrapper.vm.$refs.filters.filters.has_training).to.equal(1)
      wrapper.find(CountersHeader).vm.showTrainingEvents = false
      expect(wrapper.vm.$refs.filters.filters.has_training).to.equal(null)
    })

  })

  describe('Error responses', () => {

    ([

      ['response error code 422', 422, {errors: {data: 'errors.data'}}, wrapper => {
        expect(wrapper.find('Filters').find('.errors').text()).to.equal('errors.data')
      }],

      ['response error code 400', 400, {error: {message: 'error.message'}}, wrapper => {
        expect(wrapper.vm.error).to.equal('error.message')
      }],

      ['response error other code', 500, {error: {message: 'other.code.error.message'}}, wrapper => {
        expect(wrapper.vm.error).to.equal('other.code.error.message')
      }],

      ['response other error', 500, {error: {message: 'other.error'}}, wrapper => {
        expect(wrapper.vm.error).to.equal('other.error')
      }]

    ]).forEach(conf => {

      const [label, statusCode, data, reject] = conf

      it(label, async () => {

        const wrapper = createWrapper({
          get: () => Promise.reject({
            response: { status: statusCode, data }
          })
        })

        flushPromises().then(() => {
          wrapper.vm.getEvents()
          reject(wrapper)
        })

      })

    })

  })

})
