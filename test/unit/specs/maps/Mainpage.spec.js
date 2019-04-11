import { shallowMount } from '@vue/test-utils'
import MainpageMap from '@/components/maps/Mainpage'
import { mapPropDataGen } from '../../utils'
import $moment from 'moment'
import $http from 'axios'
import '@/leaflet'

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
    attachToDocument: true,
    propsData,
    mocks: {
      $http, $store, $moment
    }
  })

  it('Mainpage map rendered', () => {
    expect(wrapper.is(MainpageMap)).to.eql(true)
  })

})
