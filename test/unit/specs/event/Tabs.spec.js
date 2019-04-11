import { shallowMount } from '@vue/test-utils'
import Tabs from '@/components/event/Tabs'
import $moment from 'moment'
import $http from 'axios'
import eventTabs from '@/data/event-tabs'

describe('event/Tabs.vue', () => {

  const wrapper = shallowMount(Tabs, {
    propsData: {
      tabs: eventTabs,
      event: {}
    },
    mocks: {
      $http,
      $moment,
      $router: {
        resolve: data => {
          return { href: '' }
        },
        currentRoute: {
          params: {}
        }
      },
      $route: {
        query: {}
      }
    }
  })

  it('Check component Tabs', () => {
    expect(wrapper.is(Tabs)).to.eql(true)
  })

})
