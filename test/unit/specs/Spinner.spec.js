import { shallowMount } from '@vue/test-utils'
import Spinner from '@/components/Spinner'

describe('Spinner.vue', () => {
  const wrapper = shallowMount(Spinner, {
    mocks: {
    }
  })
  it('Check simple spinner', () => {
    expect(wrapper.contains('.vue-simple-spinner')).to.eql(true)
  })
})
