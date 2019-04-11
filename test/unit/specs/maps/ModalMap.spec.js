import { shallowMount } from '@vue/test-utils'
import ModalMap from '@/components/maps/ModalMap'

describe('maps/ModalMap.vue', () => {
  const wrapper = shallowMount(ModalMap, {
    mocks: {
    }
  })
  it('Modal map rendered', () => {
    expect(wrapper.contains('#map-dialog')).to.eql(true)
  })
})
