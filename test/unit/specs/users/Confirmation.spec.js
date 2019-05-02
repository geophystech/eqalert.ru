import { shallowMount, createLocalVue } from '@vue/test-utils'
import Confirmation from '@/components/users/Confirmation'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks} from '../../utils'
import $moment from 'moment'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper(httpResp)
{
  const mocks = {
    $http: { post: () => httpResp },
    $moment
  }

  return shallowMount(Confirmation, {
    mocks: Object.assign(mocks, $routerMocks),
    propsData: {},
    localVue
  })
}

describe('users/Confirmation.vue', () => {

  /*const wrapper = createWrapper(Promise.resolve())

  it('Success request', async () => {
    await flushPromises()
    expect(wrapper.vm.status).to.equal('success')
  })*/

  const wrapper2 = createWrapper(Promise.reject())

  it('Error request', async () => {
    await flushPromises()
    expect(wrapper2.vm.status).to.equal('failure')
  })

})
