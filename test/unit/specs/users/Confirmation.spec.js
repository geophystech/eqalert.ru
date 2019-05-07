import {mount, createLocalVue} from '@vue/test-utils'
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

  ([

    ['Success request', 'success'],
    ['Error request', 'failure']

  ]).forEach(conf => {

    const wrapper = createWrapper(Promise.resolve())
    const [label, status] = conf

    it(label, async () => {
      flushPromises().then(() => {
        expect(wrapper.vm.status).to.equal(status)
      })
    })

  })

})
