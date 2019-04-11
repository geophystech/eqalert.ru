import { shallowMount } from '@vue/test-utils'
import GeneralInformation from '@/components/event/GeneralInformation'
import $moment from 'moment'
import $http from 'axios'

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
    }
  })

  it('Check component GeneralInformation', () => {
    expect(wrapper.is(GeneralInformation)).to.eql(true)
  })

})
