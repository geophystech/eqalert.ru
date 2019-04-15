import { shallowMount, createLocalVue } from '@vue/test-utils'
import FlashMessage from '@/components/FlashMessage'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('FlashMessage.vue', () => {

  const wrapper = shallowMount(FlashMessage, {
    mocks: { $http, $moment },
    localVue
  })

  it('Check component FlashMessage', () => {
    expect(wrapper.is(FlashMessage)).to.eql(true)
  })

})
