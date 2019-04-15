import { shallowMount, createLocalVue } from '@vue/test-utils'
import GeneralInformationMap from '@/components/maps/GeneralInformation'
import BootstrapVue from 'bootstrap-vue'
import $http from 'axios'
import '@/leaflet'
import {mapPropDataGen} from '../../utils'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('maps/GeneralInformation.vue', () => {

  const wrapper = shallowMount(GeneralInformationMap, {
    propsData: mapPropDataGen('GeneralInformationMap'),
    attachToDocument: true,
    mocks: { $http },
    localVue
  })

  it('GeneralInformation map rendered', () => {
    expect(wrapper.is(GeneralInformationMap)).to.eql(true)
  })

})
