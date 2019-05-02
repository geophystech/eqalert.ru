import { shallowMount, createLocalVue } from '@vue/test-utils'
import MomentTensor from '@/components/event/MomentTensor'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('event/MomentTensor.vue', () => {

  const wrapper = shallowMount(MomentTensor, {
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    },
    mocks: {
      $moment,
      $http: {
        get: () => Promise.resolve({
          data: {
            data: [

            ]
          }
        })
      }
    },
    localVue
  })

  it('Check component MomentTensor', () => {
    expect(wrapper.is(MomentTensor)).to.eql(true)
  })

})
