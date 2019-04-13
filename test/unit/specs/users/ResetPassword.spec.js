import { shallowMount, createLocalVue } from '@vue/test-utils'
import ResetPassword from '@/components/users/ResetPassword'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks} from '../../utils'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('users/ResetPassword.vue', () => {

  const wrapper = shallowMount(ResetPassword, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {
      form: {

      }
    },
    localVue
  })

  it('Check component ResetPassword', () => {
    expect(wrapper.is(ResetPassword)).to.eql(true)
  })

})
