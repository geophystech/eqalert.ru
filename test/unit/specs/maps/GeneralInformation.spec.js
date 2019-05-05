import { mount, createLocalVue } from '@vue/test-utils'
import GeneralInformationMap from '@/components/maps/GeneralInformation'
import {EVENT_GENERAL_INFO, EVENT_DATA, mapPropDataGen, deepClone} from '../../utils'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import '@/leaflet'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return mount(GeneralInformationMap, {
    propsData: mapPropDataGen('GeneralInformationMap'),
    attachToDocument: true,
    mocks: { $http },
    localVue
  })
}

const resp = {
  data: {
    data: EVENT_GENERAL_INFO
  }
}

describe('maps/GeneralInformation.vue', () => {

  ([

    ['Request data by event change', wrapper => {
      wrapper.vm.event = deepClone(EVENT_DATA)
    }, true],

    ['Request data by !has_pga_data', wrapper => {
      const event = deepClone(EVENT_DATA)
      event.has_pga_data = false
      wrapper.vm.event = event
    }],

    ['Request data default', () => {}, true]

  ]).forEach(conf => {

    const [label, mod, reject] = conf

    describe(label, () => {

      let wrapper = createWrapper({
        get: () => Promise.resolve(resp)
      })

      // const respData = resp.data.data
      mod(wrapper)

      it('Success load data', async () => {
        flushPromises().then(() => {
          expect(!!wrapper.vm.map.object).to.equal(true)
        })
      })

      wrapper.destroy()

      if (reject)
      {
        wrapper = createWrapper({
          get: () => Promise.reject({})
        })

        // const respData = resp.data.data
        mod(wrapper)

        it('Error load data', async () => {
          flushPromises().then(() => {
            expect(!!wrapper.vm.map.object).to.equal(true)
          })
        })

        wrapper.destroy()
      }

    })

  })

})
