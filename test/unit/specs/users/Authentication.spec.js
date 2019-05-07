import { mount, createLocalVue } from '@vue/test-utils'
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
    console.log(_url, _data)
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
    email: { tag: 'input', value: 'test@mail.com' },
    password: { tag: 'input', value: '12345' },
    rememberMe: { tag: 'input[type=checkbox]', value: false }
  }

  for (let [fieldName, fieldData] of Object.entries(fields)) {
    propsData.form[fieldName] = { value: fieldData.value, disabled: false }
  }

  const wrapper = mount(Authentication, {
    mocks: Object.assign(mocks, $routerMocks),
    stubs: { RouterLink },
    propsData,
    localVue
  })

  it('Check component Authentication', () => {
    expect(wrapper.is(Authentication)).to.eql(true)
  })

  describeCheckFormFields(wrapper, fields)

})
