import { shallowMount, createLocalVue } from '@vue/test-utils'
import SocialMediaLinks from '@/components/SocialMediaLinks'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('SocialMediaLinks.vue', () => {

  const wrapper = shallowMount(SocialMediaLinks, {
    mocks: { $http, $moment },
    localVue
  })

  it('Check component SocialMediaLinks', () => {
    expect(wrapper.is(SocialMediaLinks)).to.eql(true)
  })

})
