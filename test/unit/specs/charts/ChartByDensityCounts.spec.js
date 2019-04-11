import { shallowMount } from '@vue/test-utils'
import ChartByDensityCounts from '@/components/charts/ChartByDensityCounts'
import $moment from 'moment'
import $http from 'axios'

describe('charts/ChartByDensityCounts.vue', () => {

  const wrapper = shallowMount(ChartByDensityCounts, {
    mocks: {
      $http, $moment
    }
  })

  it('Check component ChartByDensityCounts', () => {
    expect(wrapper.is(ChartByDensityCounts)).to.eql(true)
  })

})
