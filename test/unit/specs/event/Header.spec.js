import { shallowMount, createLocalVue } from '@vue/test-utils'
import Header from '@/components/event/Header'
import BootstrapVue from 'bootstrap-vue'
import {$routerMocks, deepClone, EVENT_DATA} from '../../utils'
import $moment from 'moment'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper()
{
  return shallowMount(Header, {
    mocks: Object.assign({ $moment }, $routerMocks),
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    },
    localVue
  })
}

const labelVariants = {
  has_processing: 'processing',
  has_delete: 'deleted',
  has_final: 'final'
}

describe('event/Header.vue', () => {

  describe('Label variant', () => {

    Object.entries(labelVariants).forEach(labelVariant => {

      const wrapper = createWrapper()
      const event = deepClone(EVENT_DATA)

      Object.keys(labelVariants).forEach(prop => {
        event[prop] = false
      })

      event[labelVariant[0]] = true
      wrapper.event = event

      it(labelVariant[1], async () => {
        flushPromises().then(() => {
          expect(wrapper.vm.label.variant).to.eql(labelVariant[1])
        })
      })

      wrapper.destroy()

    })

  })

})
