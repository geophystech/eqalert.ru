import { mount, createLocalVue } from '@vue/test-utils'
import Buildings from '@/components/event/Buildings'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return mount(Buildings, {
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    },
    mocks: {
      $http, $moment
    },
    localVue
  })
}

const resp = {
  data: {
    data: [
      {
        damage_level: 1,
        building: {
          data: {
            destroyed: 3
          }
        }
      }, {
        damage_level: 4,
        building: {
          data: {
            destroyed: 3
          }
        }
      }
    ]
  }
}

describe('event/Buildings.vue', () => {

  ([

    [ 'Request data by event change', wrapper => { wrapper.vm.event = {id: 'ob93enBa'} } ],
    [ 'Request data default', wrapper => { wrapper.vm.fetchData() } ]

  ]).forEach(conf => {

    const [label, mod] = conf

    describe(label, () => {

      const wrapper = createWrapper({
        get: () => Promise.resolve(resp)
      })

      const respData = resp.data.data
      mod(wrapper)

      it('Load data', async () => {
        flushPromises().then(() => {
          expect(wrapper.vm.items[wrapper.vm.items.length - 2].value).to.equal(respData.length)
        })
      })

    })

  })

})
