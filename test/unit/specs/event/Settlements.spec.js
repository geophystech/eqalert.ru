import { mount, createLocalVue } from '@vue/test-utils'
import Settlements from '@/components/event/Settlements'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return mount(Settlements, {
    mocks: { $http, $moment },
    localVue,
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    }
  })
}

const msk64Values = [1.25, 1.75, 2.25, 2.75, 3.25, 3.75, 4.25, 4.75, 5.25, 5.75,
  6.25, 6.75, 7.25, 7.75, 8.25, 8.75, 9.25, 9.75, 10.25, 10.75, 11.25, 11.75]

const resp = {
  data: {
    data: msk64Values.map((msk64Value, index) => {
      return {
        msk64_value: msk64Value,
        ep_dis: 1.1308 * (index + 1),
        settlement: {
          data: {
            id: index + 1,
            latitude: 52.340278,
            longitude: 143.065,
            population: 789,
            translation: {
              data: {
                locale: 'ru',
                area: `Area ${index}`,
                title: `Title ${index}`,
                region: `Region ${index}`
              }
            }
          }
        }
      }
    })
  }
}

describe('event/Settlements.vue', () => {

  ([

    [ 'Request data by event change', wrapper => { wrapper.vm.event = {id: 'ob93enBa'} } ],
    [ 'Request data default', () => {} ]

  ]).forEach(conf => {

    const [label, mod] = conf

    describe(label, () => {

      const wrapper = createWrapper({
        get: () => Promise.resolve(resp)
      })

      const respData = resp.data.data
      mod(wrapper)

      it('Load data', async() => {
        flushPromises().then(() => {
          expect(wrapper.items.length).to.equal(respData.length)
        })
      })

    })

  })

})
