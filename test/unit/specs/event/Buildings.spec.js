import { mount, createLocalVue } from '@vue/test-utils'
import Buildings from '@/components/event/Buildings'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import flushPromises from 'flush-promises'
import {EVENT_BUIDINGS} from '../../utils'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const $store = {
  getters: {
    msk64ConfigVersion: 'msk64ConfigVersion'
  }
}

function createWrapper($http)
{
  return mount(Buildings, {
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
    data: EVENT_BUIDINGS
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

      it('Load data', async() => {
        flushPromises().then(() => {
          expect(wrapper.vm.items[wrapper.vm.items.length - 2].value).to.equal(respData.length)
          expect(wrapper.vm.items[wrapper.vm.items.length - 1].value).to.equal($store.getters.msk64ConfigVersion)
        })
      })

    })

  })

})
