import { shallowMount, createLocalVue } from '@vue/test-utils'
import Analytics from '@/components/Analytics'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Analytics.vue', () => {

  const wrapper = shallowMount(Analytics, {
    mocks: { $http, $moment },
    localVue
  })

  it('Check component Analytics', () => {
    expect(wrapper.is(Analytics)).to.eql(true)
  })

})
