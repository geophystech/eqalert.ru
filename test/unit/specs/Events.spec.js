import { shallowMount, createLocalVue } from '@vue/test-utils'
import Events from '@/components/Events'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Events.vue', () => {

  const wrapper = shallowMount(Events, {
    mocks: { $http, $moment },
    propsData: {
      spinners: {},
      events: []
    },
    localVue
  })

  it('Check component Events', () => {
    expect(wrapper.is(Events)).to.eql(true)
  })

})
