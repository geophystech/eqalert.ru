import { mount, createLocalVue } from '@vue/test-utils'
import { $routerMocks, describeCheckFormFields } from '../utils'
import flushPromises from 'flush-promises'
import Filters from '@/components/Filters'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const fields = {
  has_mt: { tag: 'input[type=checkbox]' },
  datetime_max: { tag: 'input' },
  datetime_min: { tag: 'input' },
  sta_num_min: { tag: 'input' },
  depth_max: { tag: 'input' },
  depth_min: { tag: 'input' },
  mag_max: { tag: 'input' },
  mag_min: { tag: 'input' },
  lat_max: { tag: 'input' },
  lat_min: { tag: 'input' },
  lon_max: { tag: 'input' },
  lon_min: { tag: 'input' },
  rms_max: { tag: 'input' }
}

describe('Filters.vue', () => {

  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  $routerMocks.$route.query = {}
  const values = [true, false, 1, '1', '']
  Object.keys(fields).forEach(prop => {
    $routerMocks.$route.query[prop] = values[0]
    values.push(values.shift())
  })

  const wrapper = mount(Filters, {
    mocks: Object.assign({ $moment, $store }, $routerMocks),
    attachToDocument: true,
    localVue
  })

  it('Check component Filters', () => {
    expect(wrapper.is(Filters)).to.eql(true)
  })

  describeCheckFormFields(wrapper, fields, {
    label: 'Check filter fields'
  })

  describe('Filters Change', () => {

    const magMinField = wrapper.find('input[name="mag_min"]')

    it('Form change', async () => {

      magMinField.setValue(1)
      magMinField.trigger('input.native')

      flushPromises().then(() => {
        expect(wrapper.vm.filtersChanged).to.equal(true)
        expect(wrapper.vm.sendBtnFade).to.equal(true)
      })

    })

    it('Form submit', async () => {
      wrapper.trigger('submit')

      flushPromises().then(() => {
        expect(wrapper.vm.filtersChanged).to.equal(false)
        expect(wrapper.vm.sendBtnFade).to.equal(false)
        wrapper.trigger('reset')
      })
    })

    it('Response errors', async () => {

      const errors = {
        _otherError: ['Other error']
      }

      Object.keys(fields).forEach(prop => {
        errors[prop] = [`Error msg ${prop}`]
      })

      wrapper.vm.setErrors(errors)

      flushPromises().then(() => {
        for (let [prop, msg] of Object.entries(wrapper.vm.errorMessages)) {
          expect(msg).to.equal(`<p>${errors[prop].join('</p><p>')}</p>`)
        }
      })
    })

  })

})
