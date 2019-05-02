import { shallowMount, createLocalVue } from '@vue/test-utils'
import Authentication from '@/components/users/Authentication'
import BootstrapVue from 'bootstrap-vue'
import Toasted from 'vue-toasted'
import $moment from 'moment'
import {$routerMocks, RouterLink, describeCheckFormFields} from '../../utils'
// import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Toasted)

const request = (_url, _data) => {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

const mockHttp = {
  get: request,
  post: request
}

const mocks = {

  $http: mockHttp,
  $moment,

  $refs: {
    form: {
      checkValidity: () => true
    }
  },

  $toasted: {
    success: (msg, params) => {}
  }

}

const propsData = {
  form: {

  }
}

describe('users/Authentication.vue', () => {

  const fields = {
    email: { tag: 'b-form-input-stub', value: 'test@mail.com' },
    password: { tag: 'b-form-input-stub', value: '12345' },
    rememberMe: { tag: 'b-form-checkbox-stub', value: false }
  }

  Object.entries(fields).forEach((fieldName, fieldData) => {
    propsData.form[fieldName] = { value: fieldData.value, disabled: false }
  })

  const wrapper = shallowMount(Authentication, {
    mocks: Object.assign(mocks, $routerMocks),
    stubs: { RouterLink },
    propsData,
    localVue
  })

  it('Check component Authentication', () => {
    expect(wrapper.is(Authentication)).to.eql(true)
  })

  describeCheckFormFields(wrapper, { fields })

})
