import { mount, createLocalVue } from '@vue/test-utils'
import ModalMap from '@/components/maps/ModalMap'
import BootstrapVue from 'bootstrap-vue'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return mount(ModalMap, {
    attachToDocument: true,
    mocks: {$http},
    localVue
  })
}

const resp = {
  data: {
    data: [
      {
        id: 'oBJPmNbm',
        agency: 'SAK',
        event_datetime: '2019-04-11 00:00:01',
        lat: 51.45341,
        lon: 143.382385,
        depth: 20,
        mag: 6.5,
        mag_t: 'L'
      },
      {
        id: '6ZLwQXBX',
        agency: 'SAK',
        event_datetime: '2019-04-07 00:00:01',
        lat: 51.45341,
        lon: 143.382385,
        depth: 30,
        mag: 8.5,
        mag_t: 'L'
      },
      {
        id: '3ZQVmDb9',
        agency: 'SAK',
        event_datetime: '2019-01-29 00:00:01',
        lat: 42.71859,
        lon: 146.614347,
        depth: 30,
        mag: 8.5,
        mag_t: 'L'
      }
    ],
    meta: {
      pagination: {
        total: 3,
        count: 3,
        per_page: 1000,
        current_page: 1,
        total_pages: 1,
        links: []
      }
    }
  }
}

describe('maps/ModalMap.vue', () => {

  const wrapper = createWrapper({
    get: () => Promise.resolve(resp)
  })

  it('Modal map rendered', async () => {

    wrapper.contains('#map-dialog').trigger('click')

    flushPromises().then(() => {
      expect(!!wrapper.vm.map.object).to.equal(true)
    })

  })

})
