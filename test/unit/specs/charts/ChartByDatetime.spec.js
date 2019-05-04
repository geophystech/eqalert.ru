import { mount, createLocalVue } from '@vue/test-utils'
import ChartByDatetime from '@/components/charts/ChartByDatetime'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return mount(ChartByDatetime, {
    mocks: { $http, $moment },
    localVue
  })
}

const resp = {
  data: {
    data: {
      dates: ['2018-11-04', '2018-12-01', '2019-01-01', '2019-02-02', '2019-03-02', '2019-04-01', '2019-05-01'],
      range: {start: '2018-11-04', end: '2019-05-02'},
      counts: [42, 98, 47, 69, 65, 69, 5],
      total_count: 395
    }
  }
}

describe('charts/ChartByDatetime.vue', () => {

  const respData = resp.data.data

  describe('Request data', () => {

    const wrapper = createWrapper({
      get: () => Promise.resolve(resp)
    })

    wrapper.vm.drawChart()

    it('Chart datasets label', async () => {
      flushPromises().then(() => {
        expect(wrapper.vm.chartData.datasets[0].label).to.equal('Количество землетрясений')
      })
    })

    it('Chart datasets data', async () => {
      flushPromises().then(() => {
        expect(wrapper.vm.chartData.datasets[0].data).to.equal(respData.counts)
      })
    })

    it('Chart labels', async () => {
      flushPromises().then(() => {
        const dates = wrapper.vm.prepareDates(respData.dates)
        expect(wrapper.vm.chartData.labels).to.equal(dates)
      })
    })

  })

})
