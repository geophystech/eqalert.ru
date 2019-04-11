import { shallowMount } from '@vue/test-utils'
import ChartByRMSAllocation from '@/components/charts/ChartByRMSAllocation'
import $moment from 'moment'
import $http from 'axios'

describe('charts/ChartByRMSAllocation.vue', () => {

  const wrapper = shallowMount(ChartByRMSAllocation, {
    mocks: {
      $http, $moment
    }
  })

  it('Check component ChartByRMSAllocation', () => {
    expect(wrapper.is(ChartByRMSAllocation)).to.eql(true)
  })

})
