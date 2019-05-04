import { shallowMount, createLocalVue } from '@vue/test-utils'
import GeneralInformation from '@/components/event/GeneralInformation'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const eventData = {
  processingMethod: {
    long: null
  },
  locValues: {
    data: {
      event_datetime: new Date()
    }
  }
}

describe('event/GeneralInformation.vue', () => {

  ([

    [ 'Set data by event change', wrapper => { wrapper.vm.event = eventData } ],
    [ 'Set data default', wrapper => {} ]

  ]).forEach(conf => {

    const [label, mod] = conf

    describe(label, () => {

      const wrapper = shallowMount(GeneralInformation, {
        propsData: { event: eventData },
        mocks: { $moment },
        localVue
      })

      mod(wrapper)

      it('Set data', () => {
        expect(wrapper.is(GeneralInformation)).to.eql(true)
      })

    })

  })

})
