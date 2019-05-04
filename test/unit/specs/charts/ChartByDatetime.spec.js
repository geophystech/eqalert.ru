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
    sync: false,
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

  it('Request data', async () => {

    let wrapper = createWrapper({
      get: () => Promise.resolve(resp)
    })

    flushPromises().then(() => {
      expect(JSON.stringify(wrapper.vm.chartData.datasets[0].data))
        .to.equal(JSON.stringify(respData.counts))
    })

  })

})
