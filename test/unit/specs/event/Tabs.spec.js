import { shallowMount } from '@vue/test-utils'
import Tabs from '@/components/event/Tabs'
import $moment from 'moment'
import $http from 'axios'
import eventTabs from '@/data/event-tabs'
import {$routerMocks} from '../../utils'

describe('event/Tabs.vue', () => {

  const wrapper = shallowMount(Tabs, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {
      tabs: eventTabs,
      event: {}
    }
  })

  it('Check component Tabs', () => {
    expect(wrapper.is(Tabs)).to.eql(true)
  })

})
