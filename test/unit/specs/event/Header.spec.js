import { shallowMount, createLocalVue } from '@vue/test-utils'
import Header from '@/components/event/Header'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'
import {$routerMocks} from '../../utils'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('event/Header.vue', () => {

  const wrapper = shallowMount(Header, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    },
    localVue
  })

  it('Check component Header', () => {
    expect(wrapper.is(Header)).to.eql(true)
  })

})
