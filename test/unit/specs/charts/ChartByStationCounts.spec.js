import { shallowMount } from '@vue/test-utils'
import ChartByStationCounts from '@/components/charts/ChartByStationCounts'
import $moment from 'moment'
import $http from 'axios'

describe('charts/ChartByStationCounts.vue', () => {

  const wrapper = shallowMount(ChartByStationCounts, {
    mocks: {
      $http, $moment
    }
  })

  it('Check component ChartByStationCounts', () => {
    expect(wrapper.is(ChartByStationCounts)).to.eql(true)
  })

})
