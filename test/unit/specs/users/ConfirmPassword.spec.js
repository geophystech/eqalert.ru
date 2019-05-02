import { mount, createLocalVue } from '@vue/test-utils'
import ConfirmPassword from '@/components/users/ConfirmPassword'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks, describeCheckFormFields, RouterLink} from '../../utils'
import $moment from 'moment'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper(httpRespHandler = Promise.resolve())
{
  const mocks = {
    $http: { post: () => httpRespHandler },
    $moment
  }

  const propsData = {
    passwordChanged: false,
    validationError: '',
    breadcrumbs: [],
    form: {
      validated: false
    }
  }

  return mount(ConfirmPassword, {
    mocks: Object.assign(mocks, $routerMocks),
    stubs: { RouterLink },
    propsData,
    localVue

  })
}

const errorResp = {
  response: {
    data: {
      email: ['email']
    }
  }
}

describe('users/ConfirmPassword.vue', () => {

  const wrapper = createWrapper()

  it('Check component ConfirmPassword', () => {
    expect(wrapper.is(ConfirmPassword)).to.eql(true)
  })

  describeCheckFormFields(wrapper, {
    password: {tag: 'input'}
  })

  describe('Form send', () => {

    const wrapper = createWrapper()
    const wrapper2 = createWrapper(Promise.reject(errorResp))

    it('Success response', async () => {

      wrapper.find('input[name="password"]').setValue('12345')
      wrapper.find('form').trigger('submit.prevent')

      await flushPromises()

      expect(wrapper.vm.passwordChanged).to.equal(true)

    })

    it('Error response', async () => {

      wrapper2.find('input[name="password"]').setValue('12345')
      wrapper2.find('form').trigger('submit.prevent')

      await flushPromises()

      expect(wrapper2.vm.validationError).to.equal(errorResp.response.data.email[0])

    })

  })

})
