import { shallowMount, createLocalVue } from '@vue/test-utils'
import BuildingsMap from '@/components/maps/Buildings'
import BootstrapVue from 'bootstrap-vue'
import $http from 'axios'
import '@/leaflet'
import {mapPropDataGen} from '../../utils'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('maps/Buildings.vue', () => {

  const wrapper = shallowMount(BuildingsMap, {
    propsData: mapPropDataGen('BuildingsMap'),
    attachToDocument: true,
    mocks: { $http },
    localVue
  })

  it('Buildings map rendered', () => {
    expect(wrapper.is(BuildingsMap)).to.eql(true)
  })
})
