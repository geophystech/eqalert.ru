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
          email: ['email']
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

    const expects = [
      [
        'Success response',
        Promise.resolve(),
        wrapper => expect(wrapper.vm.resetComplete).to.equal(true)
      ], [
        'Error empty response',
        Promise.reject({ error: 'User not exists!' }),
        wrapper => expect(wrapper.vm.validationError).to.equal('')
      ], [
        'Error response',
        Promise.reject(errorResp),
        wrapper => expect(wrapper.vm.validationError).to.equal(errorResp.response.data.errors.data.email[0])
      ]
    ]

    for (let [ title, resp, expect ] of expects)
    {
      let wrapper = createWrapper(resp)
      it(title, async () => {
        await formInit(wrapper)
        expect(wrapper)
      })
    }

  })

})
