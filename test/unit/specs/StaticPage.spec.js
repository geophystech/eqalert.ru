import { shallowMount, createLocalVue } from '@vue/test-utils'
import StaticPage from '@/components/StaticPage'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('StaticPage.vue', () => {

  const $router = {
    currentRoute: {
      params: {
        page: 'about'
      }
    }
  }

  const wrapper = shallowMount(StaticPage, {
    mocks: { $http, $moment, $router },
    localVue
  })

  it('Check component StaticPage', () => {
    expect(wrapper.is(StaticPage)).to.eql(true)
  })

})
