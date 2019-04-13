import { shallowMount, createLocalVue } from '@vue/test-utils'
import Confirmation from '@/components/users/Confirmation'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks} from '../../utils'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('users/Confirmation.vue', () => {

  const wrapper = shallowMount(Confirmation, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {},
    localVue
  })

  it('Check component Confirmation', () => {
    expect(wrapper.is(Confirmation)).to.eql(true)
  })

})
