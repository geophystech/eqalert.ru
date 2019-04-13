import { shallowMount, createLocalVue } from '@vue/test-utils'
import CountersHeader from '@/components/CountersHeader'
import BootstrapVue from 'bootstrap-vue'
import { RouterLink } from '../utils'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('CountersHeader.vue', () => {

  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const wrapper = shallowMount(CountersHeader, {
    mocks: { $http, $moment, $store },
    stubs: { RouterLink },
    localVue
  })

  it('Check component CountersHeader', () => {
    expect(wrapper.is(CountersHeader)).to.eql(true)
  })

})
