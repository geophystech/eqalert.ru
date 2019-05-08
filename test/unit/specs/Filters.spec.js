import { mount, createLocalVue } from '@vue/test-utils'
import { $routerMocks, describeCheckFormFields } from '../utils'
import flushPromises from 'flush-promises'
import Filters from '@/components/Filters'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Filters.vue', () => {

  const $store = {
    getters: {
      user: {
        authenticated: false
      }
    }
  }

  const wrapper = mount(Filters, {
    mocks: Object.assign({ $moment, $store }, $routerMocks),
    attachToDocument: true,
    localVue
  })

  it('Check component Filters', () => {
    expect(wrapper.is(Filters)).to.eql(true)
  })

  describeCheckFormFields(wrapper, {
    datetime_max: { tag: 'input' },
    datetime_min: { tag: 'input' },
    depth_max: { tag: 'input' },
    depth_min: { tag: 'input' },
    has_mt: { tag: 'input[type=checkbox]' },
    mag_max: { tag: 'input' },
    mag_min: { tag: 'input' },
    lat_max: { tag: 'input' },
    lat_min: { tag: 'input' },
    lon_max: { tag: 'input' },
    lon_min: { tag: 'input' },
    rms_max: { tag: 'input' },
    sta_num_min: { tag: 'input' }
  }, {
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
      })
    })

  })

})
