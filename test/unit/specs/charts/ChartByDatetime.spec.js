import { shallowMount, createLocalVue } from '@vue/test-utils'
import ChartByDatetime from '@/components/charts/ChartByDatetime'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('charts/ChartByDatetime.vue', () => {

  const wrapper = shallowMount(ChartByDatetime, {
    mocks: { $http, $moment },
    localVue
  })

  it('Check component ChartByDatetime', () => {
    expect(wrapper.is(ChartByDatetime)).to.eql(true)
  })

})
