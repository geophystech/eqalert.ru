import { shallowMount, createLocalVue } from '@vue/test-utils'
import Analytics from '@/components/Analytics'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const stubs = {
  CountersHeader: {
    name: 'CountersHeader',
    render(createElement) {
      return createElement('div', this.$slots.default)
    }
  },
  Filters: {
    name: 'Filters',
    render(createElement) {
      return createElement('div', this.$slots.default)
    }
  },
  ChartByDatetime: {
    name: 'ChartByDatetime',
    render(createElement) {
      return createElement('div', this.$slots.default)
    }
  }
}

describe('Analytics.vue', () => {

  const wrapper = shallowMount(Analytics, {
    mocks: {},
    localVue,
    stubs
  })

  it('Chart By Datetime Update', async () => {
    wrapper.find(stubs.ChartByDatetime).vm.$emit('update', {
      eventsCount: 10,
      startDate: 'startDate',
      endDate: 'endDate'
    })
    expect(wrapper.vm.eventsCount).to.eql(10)
    expect(wrapper.vm.startDate).to.eql('startDate')
    expect(wrapper.vm.endDate).to.eql('endDate')
  })

  it('Filters Updated', () => {
    wrapper.find(stubs.Filters).vm.$emit('filtersUpdated', {
      param1: 'param1',
      param2: 'param2',
      param3: 'param3'
    })
    expect(wrapper.vm.filtersParams).to.eql({
      param1: 'param1',
      param2: 'param2',
      param3: 'param3'
    })
  })

})
