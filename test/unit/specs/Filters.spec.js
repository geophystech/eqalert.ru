import { shallowMount, createLocalVue } from '@vue/test-utils'
import Filters from '@/components/Filters'
import BootstrapVue from 'bootstrap-vue'
import { $routerMocks, eventFilters } from '../utils'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Filters.vue', () => {

  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const wrapper = shallowMount(Filters, {
    mocks: Object.assign({ $http, $moment, $store }, $routerMocks),
    attachToDocument: true,
    localVue
  })

  it('Check component Filters', () => {
    expect(wrapper.is(Filters)).to.eql(true)
  })

  describe('Check filter fields', () => {

    for (let item of Object.entries(eventFilters))
    {
      const [filterName, filterConf] = item
      const field = wrapper.find(`${filterConf.tag}[name="${filterName}"]`)

      it(`Check filter ${filterName}`, () => {
        expect(field.exists()).to.eql(true)
      })
    }

  })

})
