import { mount, createLocalVue } from '@vue/test-utils'
import GeneralInformation from '@/components/event/GeneralInformation'
import {deepClone, EVENT_DATA} from '../../utils'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper()
{
  return mount(GeneralInformation, {
    propsData: { event: EVENT_DATA },
    mocks: { $moment },
    localVue
  })
}

describe('event/GeneralInformation.vue', () => {

  let wrapper = createWrapper()

  ;([

    ['Set data', () => {}],
    ['Set data by event change', wrapper => { wrapper.vm.event = deepClone(EVENT_DATA) }]

  ]).forEach(conf => {

    const [label, mod] = conf
    mod(wrapper)

    it(label, () => {
      const tableRows = wrapper.findAll('.table > tbody > tr')
      expect(tableRows.length).to.equal(wrapper.vm.items.length)
    })

  })

})
