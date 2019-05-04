import { shallowMount, createLocalVue } from '@vue/test-utils'
import MomentTensor from '@/components/event/MomentTensor'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper($http)
{
  return shallowMount(MomentTensor, {
    mocks: { $moment, $http },
    localVue,
    propsData: {
      event: {
        id: 'ob93enBa'
      }
    }
  })
}

const resp = {
  data: {
    data: [{
      beachball: {
        svg: 'image.svg'
      }
    }]
  }
}

describe('event/MomentTensor.vue', () => {

  const wrapper = createWrapper({
    get: () => Promise.resolve(resp)
  })

  const respData = resp.data.data[0]

  it('Load data', async () => {
    flushPromises().then(() => {
      expect(wrapper.image).to.equal(respData.beachball.svg)
    })
  })

})
