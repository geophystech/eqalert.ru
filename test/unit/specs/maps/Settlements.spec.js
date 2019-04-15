import { shallowMount, createLocalVue } from '@vue/test-utils'
import SettlementsMap from '@/components/maps/Settlements'
import BootstrapVue from 'bootstrap-vue'
import $http from 'axios'
import '@/leaflet'
import {mapPropDataGen} from '../../utils'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('maps/Settlements.vue', () => {

  const wrapper = shallowMount(SettlementsMap, {
    propsData: mapPropDataGen('SettlementsMap'),
    attachToDocument: true,
    mocks: { $http },
    localVue
  })

  it('Settlements map rendered', () => {
    expect(wrapper.is(SettlementsMap)).to.eql(true)
  })
})
