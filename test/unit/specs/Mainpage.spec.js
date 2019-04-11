import { shallowMount } from '@vue/test-utils'
import Mainpage from '@/components/Mainpage'
import $moment from 'moment'
import $http from 'axios'

describe('Mainpage.vue', () => {

  const wrapper = shallowMount(Mainpage, {
    mocks: { $http, $moment }
  })

  it('Check component Mainpage', () => {
    expect(wrapper.is(Mainpage)).to.eql(true)
  })

})
