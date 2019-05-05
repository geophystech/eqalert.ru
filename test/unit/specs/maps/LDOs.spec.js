import { mount, createLocalVue } from '@vue/test-utils'
import {EVENT_LDOS, mapPropDataGen} from '../../utils'
import LDOsMap from '@/components/maps/LDOs'
import BootstrapVue from 'bootstrap-vue'
import '@/leaflet'

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

      wrapper.vm.$options.beforeDestroy[0].call(wrapper.vm)

    })

  })

})
