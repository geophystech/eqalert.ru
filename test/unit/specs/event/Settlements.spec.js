import { shallowMount, createLocalVue } from '@vue/test-utils'
import Settlements from '@/components/event/Settlements'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('event/Settlements.vue', () => {

  const wrapper = shallowMount(Settlements, {
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

  it('Check component Settlements', () => {
    expect(wrapper.is(Settlements)).to.eql(true)
  })

})
