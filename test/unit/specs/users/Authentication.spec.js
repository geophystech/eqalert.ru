import { shallowMount, createLocalVue } from '@vue/test-utils'
import Authentication from '@/components/users/Authentication'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks, RouterLink, describeCheckFormFields} from '../../utils'
import $moment from 'moment'
// import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const request = (_url, _data) => {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

const mockHttp = {
  get: request,
  post: request
}

describe('users/Authentication.vue', () => {

  const propsData = {
    form: {

    }
  }

  const fields = {
    email: { tag: 'b-form-input-stub', value: 'test@mail.com' },
    password: { tag: 'b-form-input-stub', value: '12345' },
    rememberMe: { tag: 'b-form-checkbox-stub', value: false }
  }

  Object.entries(fields).forEach((fieldName, fieldData) => {
    propsData.form[fieldName] = { value: fieldData.value, disabled: false }
  })

  const wrapper = shallowMount(Authentication, {
    mocks: Object.assign({ $http: mockHttp, $moment }, $routerMocks),
    stubs: { RouterLink },
    propsData,
    localVue
  })

  it('Check component Authentication', () => {
    expect(wrapper.is(Authentication)).to.eql(true)
  })

  describeCheckFormFields(wrapper, { fields })

  /*it('Auth', async () => {

    wrapper.find('b-button-stub[type="submit"]').trigger('click')

  })*/

})
