import { shallowMount, createLocalVue } from '@vue/test-utils'
import Spinner from '@/components/Spinner'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Spinner.vue', () => {
  const wrapper = shallowMount(Spinner, {
    mocks: {},
    localVue
  })
  it('Check simple spinner', () => {
    expect(wrapper.contains('.vue-simple-spinner')).to.eql(true)
  })
})
