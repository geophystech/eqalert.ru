import { shallowMount } from '@vue/test-utils'
import ChartByMagnitudeCumulative from '@/components/charts/ChartByMagnitudeCumulative'
import $moment from 'moment'
import $http from 'axios'

describe('charts/ChartByMagnitudeCumulative.vue', () => {

  const wrapper = shallowMount(ChartByMagnitudeCumulative, {
    mocks: {
      $http, $moment
    }
  })

  it('Check component ChartByMagnitudeCumulative', () => {
    expect(wrapper.is(ChartByMagnitudeCumulative)).to.eql(true)
  })

})
