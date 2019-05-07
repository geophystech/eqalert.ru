import { mount, createLocalVue } from '@vue/test-utils'
import Confirmation from '@/components/users/Confirmation'
import {$routerMocks, RouterLink} from '../../utils'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper(httpResp)
{
  let mocks = {
    $http: { post: () => httpResp },
    $moment
  }

  return mount(Confirmation, {
    mocks: Object.assign(mocks, $routerMocks),
    stubs: { RouterLink },
    propsData: {},
    localVue
  })
}

describe('users/Confirmation.vue', () => {

  it('Success request', async () => {
    const wrapper = createWrapper(Promise.resolve())
    flushPromises().then(() => {
      expect(wrapper.vm.status).to.equal('success')
    })
  })

  it('Error request', async () => {
    const wrapper = createWrapper(Promise.resolve())
    flushPromises().then(() => {
      expect(wrapper.vm.status).to.equal('failure')
    })
  })

})
