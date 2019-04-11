import { shallowMount } from '@vue/test-utils'
import ChartByDatetime from '@/components/charts/ChartByDatetime'
import $moment from 'moment'
import $http from 'axios'

describe('charts/ChartByDatetime.vue', () => {

  const wrapper = shallowMount(ChartByDatetime, {
    mocks: {
      $http, $moment
    }
  })

  it('Check component ChartByDatetime', () => {
    expect(wrapper.is(ChartByDatetime)).to.eql(true)
  })

})
