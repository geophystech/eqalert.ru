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
    stubs: {
      RouterLink,
      Filters: {
        name: 'Filters',
        render: function(h) {
          return h('div', this.$slots.default)
        },
        props: []
      }
    },
    propsData: {
      spinners: {},
      events: []
    },
    localVue,
    mocks
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

  it('Event list rendered', async () => {

    const wrapper = createWrapper({
      get: () => Promise.resolve(resp())
    })

    flushPromises().then(() => {
      expect(wrapper.findAll('.events-row').length).to.equal(respLength)
    })
  })

  it('Event list rendered by load more', async () => {

    const wrapper = createWrapper({
      get: () => Promise.resolve(resp())
    })

    wrapper.vm.apiParams.cursor = 'apiParams.cursor'
    wrapper.find('#loadMoreEventsBtn').trigger('click.prevent')

    flushPromises().then(() => {
      expect(wrapper.findAll('.events-row').length).to.equal(respLength * 2)
    })
  })

  it('Check datetime format', () => {

    const wrapper = createWrapper({
      get: () => Promise.resolve(resp())
    }, {
      $root: {
        onMobile: true
      }
    })

    expect(wrapper.vm.datetimeFormat).to.equal('LL в HH:mm:ss UTC')
  })

})
