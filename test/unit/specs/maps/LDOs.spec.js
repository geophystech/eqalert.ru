import { shallowMount } from '@vue/test-utils'
import LDOsMap from '@/components/maps/LDOs'
import $http from 'axios'
import '@/leaflet'
import {mapPropDataGen} from '../../utils'

describe('maps/LDOs.vue', () => {

  const wrapper = shallowMount(LDOsMap, {
    propsData: mapPropDataGen('LDOsMap'),
    attachToDocument: true,
    mocks: {
      $http
    }
  })

  it('LDOs map rendered', () => {
    expect(wrapper.is(LDOsMap)).to.eql(true)
  })

})
