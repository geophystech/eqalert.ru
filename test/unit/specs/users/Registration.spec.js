import { shallowMount } from '@vue/test-utils'
import Registration from '@/components/users/Registration'
import {$routerMocks} from '../../utils'
import $moment from 'moment'
import $http from 'axios'

describe('users/Registration.vue', () => {

  const wrapper = shallowMount(Registration, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {
      form: {

      }
    }
  })

  it('Check component Registration', () => {
    expect(wrapper.is(Registration)).to.eql(true)
  })

})
