import { mount, createLocalVue } from '@vue/test-utils'
import ResetPassword from '@/components/users/ResetPassword'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks, describeCheckFormFields} from '../../utils'
import $moment from 'moment'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const formFields = {
  email: {tag: 'input', value: 'email@test.ru'}
}

function createWrapper(httpRespHandler = Promise.resolve())
{
  const mocks = {
    $http: { post: () => httpRespHandler },
    $moment
  }

  const propsData = {
    validationError: false,
    form: {
      validated: false,
      fields: {}
    }
  }

  for (let [fieldName, fieldData] of Object.entries(formFields)) {
    propsData.form.fields[fieldName] = { value: fieldData.value, disabled: false }
  }

  return mount(ResetPassword, {
    mocks: Object.assign(mocks, $routerMocks),
    propsData,
    localVue
  })
}

const errorResp = {
  response: {
    data: {
      errors: {
        data: {
          email: 'email'
        }
      }
    }
  }
}

describe('users/ResetPassword.vue', () => {

  const wrapper = createWrapper()

  it('Check component ResetPassword', () => {
    expect(wrapper.is(ResetPassword)).to.eql(true)
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
      expect(wrapper1.vm.resetComplete).to.equal(true)
    })

    const wrapper2 = createWrapper(Promise.reject(errorResp))
    it('Error response', async () => {
      await formInit(wrapper2)
      expect(wrapper2.vm.validationError).to.equal(errorResp.response.data.errors.data.email[0])
    })

  })

})
