import { shallowMount, createLocalVue } from '@vue/test-utils'
import LastEvents from '@/components/event/LastEvents'
import BootstrapVue from 'bootstrap-vue'
import { RouterLink } from '../../utils'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('event/LastEvents.vue', () => {

  const $route = {
    query: {}
  }

  const wrapper = shallowMount(LastEvents, {
    mocks: { $http, $moment, $route },
    stubs: { RouterLink },
    localVue
  })

  it('Check component LastEvents', () => {
    expect(wrapper.is(LastEvents)).to.eql(true)
  })

})
