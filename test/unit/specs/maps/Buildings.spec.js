import { shallowMount } from '@vue/test-utils'
import BuildingsMap from '@/components/maps/Buildings'
import $http from 'axios'
import '@/leaflet'
import {mapPropDataGen} from '../../utils'

describe('maps/Buildings.vue', () => {

  const wrapper = shallowMount(BuildingsMap, {
    propsData: mapPropDataGen('BuildingsMap'),
    attachToDocument: true,
    mocks: {
      $http
    }
  })

  it('Buildings map rendered', () => {
    expect(wrapper.is(BuildingsMap)).to.eql(true)
  })
})
