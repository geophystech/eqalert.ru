import {mount, createLocalVue} from '@vue/test-utils'
import Tabs from '@/components/event/Tabs'
import BootstrapVue from 'bootstrap-vue'
import eventTabs from '@/data/event-tabs'
import {$routerMocks, EVENT_DATA, deepClone} from '../../utils'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper()
{
  return mount(Tabs, {
    mocks: Object.assign({ $moment }, $routerMocks),
    propsData: {
      event: deepClone(EVENT_DATA),
      tabs: eventTabs
    },
    localVue
  })
}

describe('event/Tabs.vue', () => {

  describe('Meta Info', () => {
    const wrapper = createWrapper()
    it('Title', () => {
      const metaInfo = wrapper.vm.$options.metaInfo.call(wrapper.vm)
      expect(!!metaInfo.title.length).to.equal(true)
    })
  })

  ;([

    [ 'Set data by event change', wrapper => { wrapper.vm.event = deepClone(EVENT_DATA) } ],
    [ 'Set data default', () => {} ]

  ]).forEach(conf => {

    const [label, mod] = conf

    describe(label, () => {

      const wrapper = createWrapper()
      mod(wrapper)

      it('Tab active item change', () => {
        //const tab = Object.keys(eventTabs)[1]
        const navLink = wrapper.find('.nav-link:not(.active)')
        navLink.trigger('click')
        expect(navLink.classes()).to.contain('active')
      })

    })

  })

})
