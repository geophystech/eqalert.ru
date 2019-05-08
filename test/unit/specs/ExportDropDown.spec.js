import { mount, createLocalVue } from '@vue/test-utils'
import ExportDropDown from '@/components/ExportDropDown'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  const $store = {
    getters: {
      user: {
        authenticated: true,
        permissions: {
          xls_access: 'xls_access'
        }
      }
    }
  }

  return mount(ExportDropDown, {
    mocks: { $http, $store },
    attachToDocument: true,
    localVue
  })
}

const resp = {
  response: {
    data: {
      data: {
        url: 'xls file url'
      }
    }
  }
}

describe('ExportDropDown.vue', () => {

  const wrapper = createWrapper({
    get: () => Promise.resolve(resp)
  })

  it('Request xls file url', async () => {
    wrapper.find('.dropdown-item').trigger('click')
    flushPromises().then(() => {
      expect(window.location.href).to.equal(resp.response.data.data.url)
      wrapper.trigger('hide')
    })
  })

})
