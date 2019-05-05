import { mount, createLocalVue } from '@vue/test-utils'
import MainpageMap from '@/components/maps/Mainpage'
import { mapPropDataGen } from '../../utils'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import '@/leaflet'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  return mount(MainpageMap, {
    propsData: mapPropDataGen('MainpageMap'),
    mocks: { $http, $store, $moment },
    attachToDocument: true,
    localVue
  })
}

const resp = {
  data: {
    data: [
      {
        id: 'rZK6geBq',
        agency: 'USGS',
        event_datetime: '2019-05-04 21:58:00',
        lat: 53.452,
        lon: 160.759,
        depth: 61.8,
        mag: 4.2,
        mag_t: 'B'
      },
      {
        id: '6ZLw2vBX',
        agency: 'USGS',
        event_datetime: '2019-05-04 21:34:12',
        lat: 43.894,
        lon: 148.068,
        depth: 35,
        mag: 4.5,
        mag_t: 'B'
      },
      {
        id: 'qZ5gXvAW',
        agency: 'USGS',
        event_datetime: '2019-05-04 16:40:25',
        lat: 43.175,
        lon: 146.431,
        depth: 59.4,
        mag: 5.1,
        mag_t: 'WW'
      }
    ],
    meta: {
      pagination: {
        total: 16,
        count: 16,
        per_page: 500,
        current_page: 1,
        total_pages: 1,
        links: []
      }
    }
  }
}

describe('maps/Mainpage.vue', () => {

  const wrapper = createWrapper({
    get: () => Promise.resolve(resp)
  })

  it('Check map', async () => {
    flushPromises().then(() => {
      expect(!!wrapper.vm.map.object).to.equal(true)
    })
  })

})
