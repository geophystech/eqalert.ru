import { shallowMount, createLocalVue } from '@vue/test-utils'
import Settlements from '@/components/event/Settlements'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return shallowMount(Settlements, {
    mocks: { $http, $moment },
    localVue,
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    }
  })
}

const resp = {
  data: {
    data: [
      {
        ep_dis: 16.1308,
        msk64_value: 1.4,
        settlement: {
          data: {
            id: 11,
            latitude: 52.340278,
            longitude: 143.065,
            population: 789,
            translation: {
              data: {
                locale: 'ru',
                area: 'МО ГО "Ногликский"',
                title: 'с. Вал',
                region: 'Сахалин'
              }
            }
          }
        }
      }, {
        ep_dis: 17.332,
        msk64_value: 1.3,
        settlement: {
          data: {
            id: 13,
            latitude: 52.0425,
            longitude: 143.085,
            population: 2,
            translation: {
              data: {
                locale: 'ru',
                area: 'МО ГО "Ногликский"',
                title: 'с. Горячие Ключи',
                region: 'Сахалин'
              }
            }
          }
        }
      }
    ]
  }
}

describe('event/Settlements.vue', () => {

  const wrapper = createWrapper({
    get: () => Promise.resolve(resp)
  })

  const respData = resp.data.data

  it('Load data', async () => {
    flushPromises().then(() => {
      expect(wrapper.items.length).to.equal(respData.length)
    })
  })

})
