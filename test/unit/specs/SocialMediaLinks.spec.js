import { shallowMount } from '@vue/test-utils'
import SocialMediaLinks from '@/components/SocialMediaLinks'
import $moment from 'moment'
import $http from 'axios'

describe('SocialMediaLinks.vue', () => {

  const wrapper = shallowMount(SocialMediaLinks, {
    mocks: { $http, $moment }
  })

  it('Check component SocialMediaLinks', () => {
    expect(wrapper.is(SocialMediaLinks)).to.eql(true)
  })

})
