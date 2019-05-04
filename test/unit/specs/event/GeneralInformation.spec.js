import { shallowMount, createLocalVue } from '@vue/test-utils'
import GeneralInformation from '@/components/event/GeneralInformation'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'
import $http from 'axios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('event/GeneralInformation.vue', () => {

  const wrapper = shallowMount(GeneralInformation, {
    propsData: {
      event: {
        processingMethod: {
          long: null
        },
        locValues: {
          data: {
            event_datetime: new Date()
          }
        }
      }
    },
    mocks: {
      $http, $moment
    },
    localVue
  })

  it('Check component GeneralInformation', () => {
    expect(wrapper.is(GeneralInformation)).to.eql(true)
  })

})
