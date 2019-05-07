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

function createWrapper(httpRespHandler = () => Promise.reject())
{
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

  const $http = {
    get: () => Promise.resolve({
      data: { data: PURPOSES }
    }),
    post: httpRespHandler
  }

  return mount(Registration, {
    mocks: Object.assign({ $http, $moment }, $routerMocks),
    stubs: {RouterLink},
    propsData,
    localVue
  })
}

const errors = {
  purpose_of_use: ['Purpose error'],
  company_name: ['Company error'],
  full_name: ['Full name error'],
  other: ['Other error']
}

const errorResp = {
  response: {
    data: {
      errors: {
        data: errors
      }
    }
  }
}

describe('users/Registration.vue', () => {

  const wrapper = createWrapper()

  describeCheckFormFields(wrapper, formFields, {
    async: true
  })

  describe('Form', () => {

    it('Show additional info', () => {
      wrapper.find('.show-additional-info').trigger('click')
      expect(wrapper.vm.form.showAdditionalInfo).to.equal(true)
    })

  })

  wrapper.destroy()

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
        wrapper => expect(wrapper.vm.registrationComplete).to.equal(true)
      ], [
        'Error response',
        () => Promise.reject(errorResp),
        wrapper => {
          for (let [errorProp, msgs] of Object.entries(errors)) {
            expect(wrapper.vm.form.messages[wrapper.vm.transformFieldName(errorProp)]).to.equal(msgs[0])
          }
        }
      ]

    ]).forEach(conf => {

      const [ title, httpRespHandler, expect ] = conf
      const wrapper = createWrapper(httpRespHandler)

      it(title, async () => {
        formInit(wrapper).then(() => {
          expect(wrapper)
        })
      })

      wrapper.destroy()

    })

  })

})
