import { shallowMount, createLocalVue } from '@vue/test-utils'
import Registration from '@/components/users/Registration'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks, describeCheckFormFields, RouterLink} from '../../utils'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('users/Registration.vue', () => {

  const wrapper = shallowMount(Registration, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {
      breadcrumbs: [],
      form: {

      }
    },
    stubs: {
      RouterLink
    },
    localVue
  })

  it('Check component Registration', () => {
    expect(wrapper.is(Registration)).to.eql(true)
  })

  describeCheckFormFields(wrapper, {
    email: {tag: 'b-form-input-stub'},
    password: {tag: 'b-form-input-stub'},
    company: {tag: 'b-form-input-stub'},
    purpose: {tag: 'b-form-select-stub'},
    fullname: {tag: 'b-form-input-stub'},
    additionalInfo: {tag: 'b-form-textarea-stub'}
  })

})
