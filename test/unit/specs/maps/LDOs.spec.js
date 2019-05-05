import { mount, createLocalVue } from '@vue/test-utils'
import LDOsMap from '@/components/maps/LDOs'
import BootstrapVue from 'bootstrap-vue'
import '@/leaflet'
import {EVENT_LDOS, mapPropDataGen} from '../../utils'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper()
{
  return mount(LDOsMap, {
    propsData: mapPropDataGen('LDOsMap'),
    attachToDocument: true,
    mocks: {},
    localVue
  })
}

describe('maps/LDOs.vue', () => {

  const wrapper = createWrapper()

  ;([

    [ 'Create map', wrapper => { wrapper.vm.addData(EVENT_LDOS) } ],
    [ 'Create map by event change', wrapper => { wrapper.vm.event = mapPropDataGen('LDOsMap').event } ]

  ]).forEach(conf => {

    const [label, mod] = conf

    describe(label, () => {

      mod(wrapper)

      it('Check map', () => {
        expect(!!wrapper.vm.map.object).to.equal(true)
      })

    })

  })

})
