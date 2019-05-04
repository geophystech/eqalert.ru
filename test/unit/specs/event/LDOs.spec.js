import {mount, createLocalVue} from '@vue/test-utils'
import LDOs from '@/components/event/LDOs'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const $store = {
  getters: {
    msk64ConfigVersion: 'msk64ConfigVersion',
    srssDBVersion: 'srssDBVersion'
  }
}

function createWrapper($http)
{
  return mount(LDOs, {
    mocks: { $http, $moment, $store },
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
        parts: {
          data: [{
            damage: {
              data: {
                damage_level: 5
              }
            }
          }]
        }
      }, {
        parts: {
          data: [{
            damage: {
              data: {
                damage_level: 5
              }
            }
          }]
        }
      }
    ]
  }
}

describe('event/LDOs.vue', () => {

  const wrapper = createWrapper({
    get: () => Promise.resolve(resp)
  })

  const respData = resp.data.data

  it('Load data', async () => {
    flushPromises().then(() => {
      expect(wrapper.vm.items[6].value).to.equal($store.getters.srssDBVersion)
      expect(wrapper.vm.items[7].value).to.equal(respData.length)
      expect(wrapper.vm.items[8].value).to.equal($store.getters.msk64ConfigVersion)
    })
  })

})
