import { mount, createLocalVue } from '@vue/test-utils'
import CountersHeader from '@/components/CountersHeader'
import BootstrapVue from 'bootstrap-vue'
import { RouterLink } from '../utils'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('CountersHeader.vue', () => {

  const $store = {
    getters: {
      user: {
        authenticated: true,
        permissions: {
          reports: 'reports'
        }
      }
    }
  }

  const wrapper = mount(CountersHeader, {
    mocks: { $http, $moment, $store },
    stubs: { RouterLink },
    propsData: {
      trainingEventsBtnShow: true,
      showTrainingEvents: false
    },
    localVue
  })

  it('Toggle Training Events', () => {
    wrapper.find('#showTraining').trigger('click')
    expect(wrapper.vm.showTrainingEvents).to.eql(true)
    wrapper.find('#showTraining').trigger('click')
    expect(wrapper.vm.showTrainingEvents).to.eql(false)
  })

})
