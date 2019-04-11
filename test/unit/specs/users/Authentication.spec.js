import { shallowMount } from '@vue/test-utils'
import Authentication from '@/components/users/Authentication'
import {$routerMocks} from '../../utils'
import $moment from 'moment'
import $http from 'axios'

describe('users/Authentication.vue', () => {

  const wrapper = shallowMount(Authentication, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {
      form: {

      }
    }
  })

  it('Check component Authentication', () => {
    expect(wrapper.is(Authentication)).to.eql(true)
  })

})
