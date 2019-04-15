import { shallowMount, createLocalVue } from '@vue/test-utils'
import ChartByDensityCounts from '@/components/charts/ChartByDensityCounts'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('charts/ChartByDensityCounts.vue', () => {

  const wrapper = shallowMount(ChartByDensityCounts, {
    mocks: { $http, $moment },
    localVue
  })

  it('Check component ChartByDensityCounts', () => {
    expect(wrapper.is(ChartByDensityCounts)).to.eql(true)
  })

})
