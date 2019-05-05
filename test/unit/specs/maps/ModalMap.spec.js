import { mount, createLocalVue } from '@vue/test-utils'
import ModalMap from '@/components/maps/ModalMap'
import BootstrapVue from 'bootstrap-vue'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const previousRequest = {abort: () => {}}

function createWrapper($http)
{
  const wrapper = mount(ModalMap, {
    attachToDocument: true,
    mocks: {$http},
    localVue
  })

  wrapper.setData({previousRequest})

  return wrapper
}

const $http = {
  get: (url, opts) => {
    opts.before(previousRequest)
    return Promise.resolve(resp)
  }
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

  let wrapper = createWrapper($http)

  it('Modal map rendered', () => {
    wrapper.find('#map-dialog-btn').trigger('click')
    expect(wrapper.contains('#map-dialog')).to.eql(true)
  })

  wrapper.destroy()
  wrapper = createWrapper($http)

  it('Modal opening', async () => {
    wrapper.find('#map-dialog-btn').trigger('click')
    wrapper.vm.onOpen()
    flushPromises().then(() => {
      expect(!!wrapper.vm.map.object).to.eql(true)
    })
  })

  wrapper.destroy()
  wrapper = createWrapper($http)

  it('Modal closing', async () => {

    wrapper.find('#map-dialog-btn').trigger('click')

    flushPromises().then(() => {

      wrapper.find('#map-dialog .close').trigger('click')
      wrapper.vm.onClose()

      flushPromises().then(() => {
        expect(wrapper.contains('#map-dialog')).to.eql(false)
        expect(!!wrapper.vm.map.object).to.eql(false)
      })

    })
  })

})
