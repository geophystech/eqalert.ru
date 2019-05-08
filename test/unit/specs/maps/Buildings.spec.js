import { mount, createLocalVue } from '@vue/test-utils'
import BuildingsMap from '@/components/maps/Buildings'
import BootstrapVue from 'bootstrap-vue'
import {EVENT_BUIDINGS, mapPropDataGen} from '../../utils'
import '@/leaflet'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper()
{
  return mount(BuildingsMap, {
    propsData: mapPropDataGen('BuildingsMap'),
    attachToDocument: true,
    mocks: {},
    localVue
  })
}

describe('maps/Buildings.vue', () => {

  const wrapper = createWrapper()

  ;([

    [ 'Create map', wrapper => { wrapper.vm.addData(EVENT_BUIDINGS) } ],
    [ 'Create map by event change', wrapper => { wrapper.vm.event = mapPropDataGen('BuildingsMap').event } ]

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
