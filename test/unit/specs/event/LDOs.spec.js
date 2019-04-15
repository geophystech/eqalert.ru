import { shallowMount, createLocalVue } from '@vue/test-utils'
import LDOs from '@/components/event/LDOs'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('event/LDOs.vue', () => {

  const wrapper = shallowMount(LDOs, {
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    },
    mocks: {
      $http, $moment
    },
    localVue
  })

  it('Check component LDOs', () => {
    expect(wrapper.is(LDOs)).to.eql(true)
  })

})
