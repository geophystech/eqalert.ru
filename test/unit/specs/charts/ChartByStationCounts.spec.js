import { shallowMount, createLocalVue } from '@vue/test-utils'
import ChartByStationCounts from '@/components/charts/ChartByStationCounts'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('charts/ChartByStationCounts.vue', () => {

  const wrapper = shallowMount(ChartByStationCounts, {
    mocks: { $http, $moment },
    localVue
  })

  it('Check component ChartByStationCounts', () => {
    expect(wrapper.is(ChartByStationCounts)).to.eql(true)
  })

})
