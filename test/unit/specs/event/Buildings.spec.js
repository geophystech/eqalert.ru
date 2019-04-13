import { shallowMount, createLocalVue } from '@vue/test-utils'
import Buildings from '@/components/event/Buildings'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('event/Buildings.vue', () => {

  const wrapper = shallowMount(Buildings, {
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

  it('Check component Buildings', () => {
    expect(wrapper.is(Buildings)).to.eql(true)
  })

})
