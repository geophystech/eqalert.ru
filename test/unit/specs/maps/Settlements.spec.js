import { shallowMount } from '@vue/test-utils'
import SettlementsMap from '@/components/maps/Settlements'
import $http from 'axios'
import '@/leaflet'
import {mapPropDataGen} from '../../utils'

describe('maps/Settlements.vue', () => {

  const wrapper = shallowMount(SettlementsMap, {
    propsData: mapPropDataGen('SettlementsMap'),
    attachToDocument: true,
    mocks: {
      $http
    }
  })

  it('Settlements map rendered', () => {
    expect(wrapper.is(SettlementsMap)).to.eql(true)
  })
})
