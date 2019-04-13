import { shallowMount, createLocalVue } from '@vue/test-utils'
import AppNavbar from '@/components/AppNavbar'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('AppNavbar.vue', () => {

  const wrapper = shallowMount(AppNavbar, {
    mocks: { $http, $moment },
    localVue
  })

  it('Check component AppNavbar', () => {
    expect(wrapper.is(AppNavbar)).to.eql(true)
  })

})
