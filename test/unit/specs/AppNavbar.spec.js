import { shallowMount } from '@vue/test-utils'
import AppNavbar from '@/components/AppNavbar'
import $moment from 'moment'
import $http from 'axios'

describe('AppNavbar.vue', () => {

  const wrapper = shallowMount(AppNavbar, {
    mocks: { $http, $moment }
  })

  it('Check component AppNavbar', () => {
    expect(wrapper.is(AppNavbar)).to.eql(true)
  })

})
