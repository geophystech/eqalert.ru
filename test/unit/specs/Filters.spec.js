import { mount, createLocalVue } from '@vue/test-utils'
import Filters from '@/components/Filters'
import BootstrapVue from 'bootstrap-vue'
import { $routerMocks, describeCheckFormFields } from '../utils'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Filters.vue', () => {

  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const wrapper = mount(Filters, {
    mocks: Object.assign({ $http, $moment, $store }, $routerMocks),
    attachToDocument: true,
    localVue
  })

  it('Check component Filters', () => {
    expect(wrapper.is(Filters)).to.eql(true)
  })

  describeCheckFormFields(wrapper, {
    datetime_max: { tag: 'input' },
    datetime_min: { tag: 'input' },
    depth_max: { tag: 'input' },
    depth_min: { tag: 'input' },
    has_mt: { tag: 'input[type=checkbox]' },
    mag_max: { tag: 'input' },
    mag_min: { tag: 'input' },
    lat_max: { tag: 'input' },
    lat_min: { tag: 'input' },
    lon_max: { tag: 'input' },
    lon_min: { tag: 'input' },
    rms_max: { tag: 'input' },
    sta_num_min: { tag: 'input' }
  }, {
    label: 'Check filter fields'
  })

})
