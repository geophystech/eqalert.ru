import { shallowMount } from '@vue/test-utils'
import Header from '@/components/event/Header'
import $moment from 'moment'
import $http from 'axios'
import {$routerMocks} from '../../utils'

describe('event/Header.vue', () => {

  const wrapper = shallowMount(Header, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    }
  })

  it('Check component Header', () => {
    expect(wrapper.is(Header)).to.eql(true)
  })

})
