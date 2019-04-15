import { shallowMount, createLocalVue } from '@vue/test-utils'
import ChartByMagnitudeCumulative from '@/components/charts/ChartByMagnitudeCumulative'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('charts/ChartByMagnitudeCumulative.vue', () => {

  const wrapper = shallowMount(ChartByMagnitudeCumulative, {
    mocks: { $http, $moment },
    localVue
  })

  it('Check component ChartByMagnitudeCumulative', () => {
    expect(wrapper.is(ChartByMagnitudeCumulative)).to.eql(true)
  })

})
