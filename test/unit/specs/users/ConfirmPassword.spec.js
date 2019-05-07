import { mount, createLocalVue } from '@vue/test-utils'
import {$routerMocks, describeCheckFormFields, RouterLink} from '../../utils'
import ConfirmPassword from '@/components/users/ConfirmPassword'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const formFields = {
  password: {tag: 'input', value: '12345'}
}

function createWrapper(httpRespHandler = () => Promise.resolve())
{
  const mocks = {
    $http: { post: httpRespHandler },
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

    const formInit = (wrapper) => {
      for (let [fieldName, fieldData] of Object.entries(formFields)) {
        wrapper.find(`${fieldData.tag}[name="${fieldName}"]`).setValue(fieldData.value)
      }
      wrapper.find('form').trigger('submit.prevent')
      return flushPromises()
    }

    ;([

      [
        'Success response',
        () => Promise.resolve(),
        wrapper => expect(wrapper.vm.passwordChanged).to.equal(true)
      ], [
        'Error response',
        () => Promise.reject(errorResp),
        wrapper => expect(wrapper.vm.validationError).to.equal(errorResp.response.data.email[0])
      ]

    ]).forEach(conf => {

      const [ title, resp, expect ] = conf
      const wrapper = createWrapper(resp)

      it(title, async () => {
        formInit(wrapper).then(() => {
          expect(wrapper)
        })
      })

    })

  })

})
