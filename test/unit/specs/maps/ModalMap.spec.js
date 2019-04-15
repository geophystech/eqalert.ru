import { shallowMount, createLocalVue } from '@vue/test-utils'
import ModalMap from '@/components/maps/ModalMap'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('maps/ModalMap.vue', () => {
  const wrapper = shallowMount(ModalMap, {
    mocks: {},
    localVue
  })
  it('Modal map rendered', () => {
    expect(wrapper.contains('#map-dialog')).to.eql(true)
  })
})
