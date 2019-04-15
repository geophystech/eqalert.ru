import { shallowMount, createLocalVue } from '@vue/test-utils'
import Mainpage from '@/components/Mainpage'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Mainpage.vue', () => {

  const wrapper = shallowMount(Mainpage, {
    mocks: { $http, $moment },
    localVue
  })

  it('Check component Mainpage', () => {
    expect(wrapper.is(Mainpage)).to.eql(true)
  })

})
