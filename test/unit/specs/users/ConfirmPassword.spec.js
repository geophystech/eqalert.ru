import { shallowMount, createLocalVue } from '@vue/test-utils'
import ConfirmPassword from '@/components/users/ConfirmPassword'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks, describeCheckFormFields} from '../../utils'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('users/ConfirmPassword.vue', () => {

  const wrapper = shallowMount(ConfirmPassword, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {
      form: {

      }
    },
    localVue
  })

  it('Check component ConfirmPassword', () => {
    expect(wrapper.is(ConfirmPassword)).to.eql(true)
  })

  describeCheckFormFields(wrapper, {
    password: {tag: 'b-form-input-stub'}
  })

})
