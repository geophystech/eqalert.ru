import { mount, createLocalVue } from '@vue/test-utils'
import LastEvents from '@/components/event/LastEvents'
import BootstrapVue from 'bootstrap-vue'
import { RouterLink } from '../../utils'
import $moment from 'moment'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return mount(LastEvents, {
    mocks: { $http, $moment, $route: {query: {}} },
    stubs: { RouterLink },
    localVue,
    propsData: {
      events: []
    }
  })
}

const resp = {
  data: {
    data: [
      {
        nearestCity: {
          data: {
            ep_dis: 65043.3043832,
            settlement: {
              data: {
                translation: {
                  data: {
                    title: 'Event settlement title'
                  }
                }
              }
            }
          }
        }
      }, {
        nearestCity: null
      }
    ]
  }
}

describe('event/LastEvents.vue', () => {

  const wrapper = createWrapper({
    get: () => Promise.resolve(resp)
  })

  const respData = resp.data.data

  it('Load data', async () => {
    flushPromises().then(() => {
      expect(wrapper.events.length).to.equal(respData.length)
    })
  })

})
