import { mount, createLocalVue } from '@vue/test-utils'
import {EVENT_DATA, EVENT_SETTLEMENTS, deepClone, mapPropDataGen} from '../../utils'
import SettlementsMap from '@/components/maps/Settlements'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import '@/leaflet'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return mount(SettlementsMap, {
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

      mod(wrapper)

      it('Check map', async() => {
        flushPromises().then(() => {
          expect(!!wrapper.vm.map.object).to.equal(true)
        })
      })

      wrapper.destroy()

    })

  })

})
