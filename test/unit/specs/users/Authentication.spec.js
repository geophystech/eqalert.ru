import { shallowMount, createLocalVue } from '@vue/test-utils'
import Authentication from '@/components/users/Authentication'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks, RouterLink, describeCheckFormFields} from '../../utils'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('users/Authentication.vue', () => {

  const wrapper = shallowMount(Authentication, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    stubs: { RouterLink },
    propsData: {
      form: {

      }
    },
    localVue
  })

  it('Check component Authentication', () => {
    expect(wrapper.is(Authentication)).to.eql(true)
  })

  describeCheckFormFields(wrapper, {
    fields: {
      email: {tag: 'b-form-input-stub'},
      password: {tag: 'b-form-input-stub'}
    }
  })

})
