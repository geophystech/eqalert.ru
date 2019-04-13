import { shallowMount, createLocalVue } from '@vue/test-utils'
import Authentication from '@/components/users/Authentication'
import BootstrapVue from 'bootstrap-vue'
import { $routerMocks, RouterLink } from '../../utils'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('users/Authentication.vue', () => {

  const wrapper = shallowMount(Authentication, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    propsData: {
      form: {

      }
    },
    stubs: {
      RouterLink
    },
    localVue
  })

  it('Check component Authentication', () => {
    expect(wrapper.is(Authentication)).to.eql(true)
  })

})
