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
  const mocks = {
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

  /*let wrapper = createWrapper(Promise.resolve())

  it('Success request', async () => {
    await flushPromises()
    expect(wrapper.vm.status).to.equal('success')
  })*/

  let wrapper2 = createWrapper(Promise.reject())

  it('Error request', async () => {
    await flushPromises()
    expect(wrapper2.vm.status).to.equal('failure')
  })

})
