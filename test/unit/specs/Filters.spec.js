import { shallowMount, createLocalVue } from '@vue/test-utils'
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

  const wrapper = shallowMount(Filters, {
    mocks: Object.assign({ $http, $moment, $store }, $routerMocks),
    attachToDocument: true,
    localVue
  })

  it('Check component Filters', () => {
    expect(wrapper.is(Filters)).to.eql(true)
  })

  describeCheckFormFields(wrapper, {
    label: 'Check filter fields',
    fields: {
      datetime_max: { tag: 'flat-pickr-stub' },
      datetime_min: { tag: 'flat-pickr-stub' },
      depth_max: { tag: 'b-form-input-stub' },
      depth_min: { tag: 'b-form-input-stub' },
      has_mt: { tag: 'b-form-checkbox-stub' },
      mag_max: { tag: 'b-form-input-stub' },
      mag_min: { tag: 'b-form-input-stub' },
      lat_max: { tag: 'b-form-input-stub' },
      lat_min: { tag: 'b-form-input-stub' },
      lon_max: { tag: 'b-form-input-stub' },
      lon_min: { tag: 'b-form-input-stub' },
      rms_max: { tag: 'b-form-input-stub' },
      sta_num_min: { tag: 'b-form-input-stub' }
    }
  })

})
