import { shallowMount } from '@vue/test-utils'
import GeneralInformationMap from '@/components/maps/GeneralInformation'
import $http from 'axios'
import '@/leaflet'
import {mapPropDataGen} from '../../utils'

describe('maps/GeneralInformation.vue', () => {

  const wrapper = shallowMount(GeneralInformationMap, {
    propsData: mapPropDataGen('GeneralInformationMap'),
    attachToDocument: true,
    mocks: {
      $http
    }
  })

  it('GeneralInformation map rendered', () => {
    expect(wrapper.is(GeneralInformationMap)).to.eql(true)
  })

})
