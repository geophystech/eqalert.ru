import {mount, createLocalVue} from '@vue/test-utils'
import ChartByDensityCounts from '@/components/charts/ChartByDensityCounts'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return mount(ChartByDensityCounts, {
    mocks: { $http, $moment },
    localVue
  })
}

const resp = {
  data: {
    data: {
      counts: [1, 0, 0, 0, 0, 0, 2, 4, 2, 3, 1, 2, 7, 6, 8, 8, 6, 6, 6, 6, 9, 3, 5, 8, 9, 7, 3, 10, 5, 2, 3, 6, 3, 4,
        0, 1, 1, 0, 2, 0, 4, 9, 22, 24, 36, 26, 42, 16, 18, 13, 11, 4, 2, 2, 5, 4, 2, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0],
      magnitudes: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9,
        2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1,
        4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6.0, 6.1, 6.2, 6.3,
        6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1, 7.2, 7.3, 7.4]
    }
  }
}

describe('charts/ChartByDensityCounts.vue', () => {

  ([

    [ 'Request data by filters', wrapper => { wrapper.vm.filtersParams = {} } ],
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
          expect(wrapper.vm.chartData.datasets[0].label).to.equal('Плотностное распределение повторяемости (ML)')
        })
      })

      it('Chart datasets data', async () => {
        flushPromises().then(() => {
          expect(wrapper.vm.chartData.datasets[0].data).to.equal(respData.counts)
        })
      })

      it('Chart labels', async () => {
        flushPromises().then(() => {
          expect(wrapper.vm.chartData.labels).to.equal(respData.magnitudes)
        })
      })

    })

  })

})
