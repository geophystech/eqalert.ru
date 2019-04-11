import { shallowMount } from '@vue/test-utils'
import ConfirmPassword from '@/components/users/ConfirmPassword'
import {$routerMocks} from '../../utils'
import $moment from 'moment'
import $http from 'axios'

describe('users/ConfirmPassword.vue', () => {

  const wrapper = shallowMount(ConfirmPassword, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {
      form: {

      }
    }
  })

  it('Check component ConfirmPassword', () => {
    expect(wrapper.is(ConfirmPassword)).to.eql(true)
  })

})
