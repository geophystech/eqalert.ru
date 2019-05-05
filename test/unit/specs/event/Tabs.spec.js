import {mount, createLocalVue} from '@vue/test-utils'
import Tabs from '@/components/event/Tabs'
import BootstrapVue from 'bootstrap-vue'
import eventTabs from '@/data/event-tabs'
import {$routerMocks} from '../../utils'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const eventData = {
  id: 'oBJPmNbm',
  report_id: '999920190411130312',
  has_final: false,
  agency: 'SAK',
  sys_md5: '91216196fb778632d0ef75c7f8a89006',
  updated_at: '2019-04-11 13:03:43',
  has_archive: false,
  has_delete: false,
  has_duplicate: false,
  has_auto: false,
  has_manual: true,
  has_loc: true,
  has_phases: false,
  has_amp: false,
  has_mt: false,
  has_msk64_data: true,
  has_cities_msk64_analysis: true,
  has_buildings_msk64_analysis: true,
  has_pga_data: true,
  has_buildings_pga_analysis: true,
  has_long_distance_objects_analysis: true,
  has_ffm: false,
  has_training: true,
  locValues: {
    data: {
      event_datetime: '2019-04-11 00:00:01',
      lat: 51.45341,
      lon: 143.382385,
      depth: 20.0,
      mag: 6.5,
      mag_t: 'L',
      rms: 0.0
    }
  },
  nearestCity: {
    data: {
      ep_dis: 29.5038,
      msk64_value: 7.0,
      settlement: {
        data: {
          id: 14,
          latitude: 51.701667,
          longitude: 143.232778,
          population: 239,
          translation: {
            data: {
              locale: 'ru',
              area: 'МО ГО "Ногликский"',
              title: 'с. Катангли',
              region: 'Сахалин'
            }
          }
        }
      }
    }
  }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function createWrapper()
{
  return mount(Tabs, {
    mocks: Object.assign({ $moment }, $routerMocks),
    propsData: {
      event: deepClone(eventData),
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

    [ 'Set data by event change', wrapper => { wrapper.vm.event = deepClone(eventData) } ],
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
