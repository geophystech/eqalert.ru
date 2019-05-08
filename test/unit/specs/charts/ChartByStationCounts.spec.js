import {mount, createLocalVue} from '@vue/test-utils'
import ChartByStationCounts from '@/components/charts/ChartByStationCounts'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return mount(ChartByStationCounts, {
    mocks: { $http, $moment },
    localVue
  })
}

const resp = {
  data: {
    data: {
      counts: [5, 10, 57, 33, 17, 16, 12, 2, 0],
      station_counts: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  }
}

describe('charts/ChartByStationCounts.vue', () => {

  ([

    [ 'Request data by filters change', wrapper => { wrapper.vm.filtersParams = {} } ],
    [ 'Request data default', wrapper => { wrapper.vm.drawChart() } ]

  ]).forEach(conf => {

    const [label, mod] = conf

    describe(label, () => {

      const wrapper = createWrapper({
        get: () => Promise.resolve(resp)
      })

      const respData = resp.data.data
      mod(wrapper)

      it('Chart datasets label', async () => {
        flushPromises().then(() => {
          expect(wrapper.vm.chartData.datasets[0].label).to.equal('События по количеству станций')
        })
      })

      it('Chart datasets data', async () => {
        flushPromises().then(() => {
          expect(wrapper.vm.chartData.datasets[0].data).to.equal(respData.counts)
        })
      })

      it('Chart labels', async () => {
        flushPromises().then(() => {
          expect(wrapper.vm.chartData.labels).to.equal(respData.station_counts)
        })
      })

    })

  })

})
