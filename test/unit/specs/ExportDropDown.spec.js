import { shallowMount } from '@vue/test-utils'
import ExportDropDown from '@/components/ExportDropDown'
import $moment from 'moment'
import $http from 'axios'

describe('ExportDropDown.vue', () => {

  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const wrapper = shallowMount(ExportDropDown, {
    mocks: { $http, $moment, $store }
  })

  it('Check component ExportDropDown', () => {
    expect(wrapper.is(ExportDropDown)).to.eql(true)
  })

})
