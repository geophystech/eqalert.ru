import { shallowMount, createLocalVue } from '@vue/test-utils'
import LDOsMap from '@/components/maps/LDOs'
import BootstrapVue from 'bootstrap-vue'
import $http from 'axios'
import '@/leaflet'
import {mapPropDataGen} from '../../utils'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('maps/LDOs.vue', () => {

  const wrapper = shallowMount(LDOsMap, {
    propsData: mapPropDataGen('LDOsMap'),
    attachToDocument: true,
    mocks: { $http },
    localVue
  })

  it('LDOs map rendered', () => {
    expect(wrapper.is(LDOsMap)).to.eql(true)
  })

})
