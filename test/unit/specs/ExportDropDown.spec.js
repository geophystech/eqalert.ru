import { shallowMount, createLocalVue } from '@vue/test-utils'
import ExportDropDown from '@/components/ExportDropDown'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('ExportDropDown.vue', () => {

  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const wrapper = shallowMount(ExportDropDown, {
    mocks: { $http, $moment, $store },
    localVue
  })

  it('Check component ExportDropDown', () => {
    expect(wrapper.is(ExportDropDown)).to.eql(true)
  })

})
