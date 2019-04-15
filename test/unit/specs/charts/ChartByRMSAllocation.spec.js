import { shallowMount, createLocalVue } from '@vue/test-utils'
import ChartByRMSAllocation from '@/components/charts/ChartByRMSAllocation'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('charts/ChartByRMSAllocation.vue', () => {

  const wrapper = shallowMount(ChartByRMSAllocation, {
    mocks: { $http, $moment },
    localVue
  })

  it('Check component ChartByRMSAllocation', () => {
    expect(wrapper.is(ChartByRMSAllocation)).to.eql(true)
  })

})
