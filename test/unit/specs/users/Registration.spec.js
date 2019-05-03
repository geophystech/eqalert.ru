import { mount, createLocalVue } from '@vue/test-utils'
import Registration from '@/components/users/Registration'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks, describeCheckFormFields, RouterLink} from '../../utils'
import $moment from 'moment'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const PURPOSES = {
  1: 'purpose 1',
  2: 'purpose 2',
  3: 'purpose 3'
}

const formFields = {
  email: {tag: 'input', value: 'email@test.ru'},
  password: {tag: 'input', value: '12345'},
  company: {tag: 'input', value: 'My company'},
  purpose: {tag: 'select', value: Object.keys(PURPOSES)[0]},
  fullname: {tag: 'input', value: 'fullname'},
  additionalInfo: {tag: 'textarea', value: 'Additional Info'}
}

function createWrapper(httpRespHandler = Promise.resolve())
{
  const mocks = {
    $http: {
      post: () => httpRespHandler,
      get: () => Promise.resolve({
        data: {
          data: PURPOSES
        }
      })
    },
    $moment
  }

  const propsData = {
    registrationComplete: false,
    breadcrumbs: [],
    form: {
      validated: false,
      messages: {},
      fields: {}
    }
  }

  for (let [fieldName, fieldData] of Object.entries(formFields)) {
    propsData.form.fields[fieldName] = { value: fieldData.value, disabled: false }
    propsData.form.messages[fieldName] = `Message fot ${fieldName}`
  }

  return mount(Registration, {
    mocks: Object.assign(mocks, $routerMocks),
    propsData,
    stubs: {
      RouterLink
    },
    localVue
  })
}

const ERROR_PROP = 'purpose_of_use'

const errorResp = {
  response: {
    data: {
      errors: {
        data: {
          [ERROR_PROP]: ['Purpose error']
        }
      }
    }
  }
}

describe('users/Registration.vue', () => {

  const wrapper = createWrapper()

  it('Check component Registration', () => {
    expect(wrapper.is(Registration)).to.eql(true)
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
        wrapper => expect(wrapper.vm.registrationComplete).to.equal(true)
      ], [
        'Error empty response',
        Promise.reject({}),
        wrapper => expect(wrapper.vm.registrationComplete).to.equal(false)
      ], [
        'Error response',
        Promise.reject(errorResp),
        wrapper => expect(wrapper.vm.form.messages[wrapper.vm.transformFieldName(ERROR_PROP)])
          .to.equal(errorResp.response.data.errors.data[ERROR_PROP][0])
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
