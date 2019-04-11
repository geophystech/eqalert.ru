import { shallowMount } from '@vue/test-utils'
import Confirmation from '@/components/users/Confirmation'
import {$routerMocks} from '../../utils'
import $moment from 'moment'
import $http from 'axios'

describe('users/Confirmation.vue', () => {

  const wrapper = shallowMount(Confirmation, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {}
  })

  it('Check component Confirmation', () => {
    expect(wrapper.is(Confirmation)).to.eql(true)
  })

})
