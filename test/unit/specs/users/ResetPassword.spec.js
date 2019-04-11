import { shallowMount } from '@vue/test-utils'
import ResetPassword from '@/components/users/ResetPassword'
import {$routerMocks} from '../../utils'
import $moment from 'moment'
import $http from 'axios'

describe('users/ResetPassword.vue', () => {

  const wrapper = shallowMount(ResetPassword, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {
      form: {

      }
    }
  })

  it('Check component ResetPassword', () => {
    expect(wrapper.is(ResetPassword)).to.eql(true)
  })

})
