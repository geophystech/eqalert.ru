import { shallowMount, createLocalVue } from '@vue/test-utils'
import MobileAppAlert from '@/components/MobileAppAlert'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('MobileAppAlert.vue', () => {

  const wrapper = shallowMount(MobileAppAlert, {
    mocks: { $http, $moment },
    localVue
  })

  it('Check component MobileAppAlert', () => {
    expect(wrapper.is(MobileAppAlert)).to.eql(true)
  })

})
