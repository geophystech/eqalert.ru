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

function createWrapper($http)
{
  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  return mount(Events, {
    mocks: Object.assign({ $http, $moment, $store }, $routerMocks),
    stubs: { RouterLink },
    propsData: {
      spinners: {},
      events: []
    },
    localVue
  })
}

const respLength = 10

const resp = () => {
  return {
    data: {
      data: Array.from({length: respLength}).map(it => {
        it = deepClone(EVENT_DATA)
        it.id = UID(10)
        return it
      })
    }
  }
}

describe('Events.vue', () => {

  let wrapper = createWrapper({
    get: () => Promise.resolve(resp())
  })

  it('Event list rendered', async () => {
    flushPromises().then(() => {
      expect(wrapper.findAll('.events-row').length).to.equal(respLength)
    })
  })

  it('Event list rendered by load more', async () => {
    wrapper.vm.apiParams.cursor = 'apiParams.cursor'
    wrapper.find('#loadMoreEventsBtn').trigger('click.prevent')
    flushPromises().then(() => {
      expect(wrapper.findAll('.events-row').length).to.equal(respLength * 2)
    })
  })

})
