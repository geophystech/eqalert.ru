import { shallowMount, createLocalVue } from '@vue/test-utils'
import SettlementsMap from '@/components/maps/Settlements'
import {EVENT_DATA, EVENT_SETTLEMENTS, deepClone, mapPropDataGen} from '../../utils'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import '@/leaflet'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return shallowMount(SettlementsMap, {
    propsData: mapPropDataGen('SettlementsMap'),
    attachToDocument: true,
    mocks: { $http },
    localVue
  })
}

const resp = {
  data: {
    data: EVENT_SETTLEMENTS
  }
}

describe('maps/Settlements.vue', () => {

  ([
    ['Create map', () => {}],
    ['Create map by event change', wrapper => { wrapper.vm.event = deepClone(EVENT_DATA) }]
  ]).forEach(conf => {

    const [label, mod] = conf

    describe(label, () => {

      let wrapper = createWrapper({
        get: () => Promise.resolve(resp)
      })

      // const respData = resp.data.data
      mod(wrapper)

      it('Check map', async () => {
        flushPromises().then(() => {
          expect(!!wrapper.vm.map.object).to.equal(true)
        })
      })

      wrapper.destroy()

    })

  })

})
