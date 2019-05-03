import { mount, createLocalVue } from '@vue/test-utils'
import ConfirmPassword from '@/components/users/ConfirmPassword'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks, describeCheckFormFields, RouterLink} from '../../utils'
import $moment from 'moment'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const formFields = {
  password: {tag: 'input', value: '12345'}
}

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

  describeCheckFormFields(wrapper, formFields)

  describe('Form send', () => {

    const formInit = async (wrapper) => {
      for (let [fieldName, fieldData] of Object.entries(formFields)) {
        wrapper.find(`${fieldData.tag}[name="${fieldName}"]`).setValue(fieldData.value)
      }
      wrapper.find('form').trigger('submit.prevent')
      return await flushPromises()
    }

    const wrapper1 = createWrapper()
    it('Success response', async () => {
      await formInit(wrapper1)
      expect(wrapper1.vm.passwordChanged).to.equal(true)
    })

    const wrapper2 = createWrapper(Promise.reject(errorResp))
    it('Error response', async () => {
      await formInit(wrapper2)
      expect(wrapper2.vm.validationError).to.equal(errorResp.response.data.email[0])
    })

  })

})
