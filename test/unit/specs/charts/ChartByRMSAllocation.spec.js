import { mount, createLocalVue } from '@vue/test-utils'
import ChartByRMSAllocation from '@/components/charts/ChartByRMSAllocation'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return mount(ChartByRMSAllocation, {
    mocks: { $http, $moment },
    localVue
  })
}

const resp = {
  data: {
    data: {
      counts: [41, 28, 24, 24, 12, 14, 4, 8, 2, 4, 43],
      rms_values: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    }
  }
}

describe('charts/ChartByRMSAllocation.vue', () => {

  const respData = resp.data.data

  describe('Request data', () => {

    const wrapper = createWrapper({
      get: () => Promise.resolve(resp)
    })

    wrapper.vm.drawChart()

    it('Chart datasets label', async () => {
      flushPromises().then(() => {
        expect(wrapper.vm.chartData.datasets[0].label).to.equal('Распределение RMS')
      })
    })

    it('Chart datasets data', async () => {
      flushPromises().then(() => {
        expect(wrapper.vm.chartData.datasets[0].data).to.equal(respData.counts)
      })
    })

    it('Chart labels', async () => {
      flushPromises().then(() => {
        expect(wrapper.vm.chartData.labels).to.equal(respData.rms_values)
      })
    })

  })

})
