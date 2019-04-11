import { shallowMount } from '@vue/test-utils'
import Header from '@/components/event/Header'
import $moment from 'moment'
import $http from 'axios'

describe('event/Header.vue', () => {

  const wrapper = shallowMount(Header, {
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    },
    mocks: {
      $http,
      $moment,
      $router: {
        resolve: data => {
          return {
            href: ''
          }
        }
      },
      $route: {
        query: {}
      }
    }
  })

  it('Check component Header', () => {
    expect(wrapper.is(Header)).to.eql(true)
  })

})
