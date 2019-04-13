import { shallowMount, createLocalVue } from '@vue/test-utils'
import MainpageMap from '@/components/maps/Mainpage'
import BootstrapVue from 'bootstrap-vue'
import { mapPropDataGen } from '../../utils'
import $moment from 'moment'
import $http from 'axios'
import '@/leaflet'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('maps/Mainpage.vue', () => {

  const propsData = mapPropDataGen('MainpageMap')

  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const wrapper = shallowMount(MainpageMap, {
    mocks: { $http, $store, $moment },
    attachToDocument: true,
    propsData,
    localVue
  })

  it('Mainpage map rendered', () => {
    expect(wrapper.is(MainpageMap)).to.eql(true)
  })

})
