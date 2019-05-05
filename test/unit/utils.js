
export function mapPropDataGen(mapId)
{
  return {
    event: deepClone(EVENT_DATA),
    tab: `test-${mapId}-tab`
  }
}

export const $routerMocks = {
  $router: {
    resolve: data => {
      let url = data.name ? `#/${data.name.toLowerCase()}` : '#'
      return { href: data.params ? `${url}/${Object.values(data.params).join('/')}` : url }
    },
    replace: data => {

    },
    currentRoute: {
      params: {}
    }
  },
  $route: {
    query: {}
  }
}

export const RouterLink = {
  name: 'router-link',
  render: function(h) {
    return h('a', this.$slots.default)
  },
  props: ['to']
}

export function describeCheckFormFields(wrapper, {fields = {}, label = 'Check form fields'} = {})
{
  describe(label, () => {

    for (let item of Object.entries(fields))
    {
      const [fieldName, fieldConf] = item
      const field = wrapper.find(`${fieldConf.tag}[name="${fieldName}"]`)

      it(`Check field ${fieldName}`, () => {
        expect(field.exists()).to.eql(true)
      })
    }

  })
}

export const EVENT_DATA = {
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

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export const EVENT_BUIDINGS = [
  {
    ep_dis: 42.72871,
    msk64_value: 6.5,
    pga_value: 10.49,
    ssi17_value: 6.94,
    delta_intensity: 0.94,
    damage_level: 3,
    building: {
      data: {
        soil_type: 0,
        building_type: 'школа',
        lat: 51.812168,
        lon: 143.162163,
        has_residential: false,
        flats: 0,
        height: 0,
        notes: 'МБОУ СОШ №2',
        max_msk64: 6,
        max_pga: 5.1,
        deterioration: 0,
        avg_day_people: 0,
        avg_night_people: 0,
        street: 'ул.Советская ',
        street_number: '41',
        fabric_type: 'деревянный',
        building_base_type: '',
        apartments_num: 0,
        built_year: 1966,
        residents: 311,
        vs30: 300,
        is_primary: true,
        data_source_reference: 'Некоммерческая организация «Фонд капитального ремонта многоквартирных домов Сахалинской области» http://fkr65.ru',
        destroyed: 3,
        settlement: {
          data: {
            id: 10,
            latitude: 51.812928,
            longitude: 143.166549,
            population: 10127,
            translation: {
              data: {
                locale: 'ru',
                area: 'МО ГО "Ногликский"',
                title: 'пгт. Ноглики',
                region: 'Сахалин'
              }
            }
          }
        }
      }
    }
  },
  {
    ep_dis: 44.39146,
    msk64_value: 6.4,
    pga_value: 10.08,
    ssi17_value: 6.9,
    delta_intensity: 0.9,
    damage_level: 3,
    building: {
      data: {
        soil_type: 0,
        building_type: 'дом',
        lat: 51.53513,
        lon: 142.75674,
        has_residential: true,
        flats: 0,
        height: 0,
        notes: '',
        max_msk64: 6,
        max_pga: 5.1,
        deterioration: 0,
        avg_day_people: 0,
        avg_night_people: 0,
        street: 'ул.Первомайская',
        street_number: '5',
        fabric_type: '',
        building_base_type: '',
        apartments_num: 8,
        built_year: 1965,
        residents: 0,
        vs30: 300,
        is_primary: false,
        data_source_reference: 'Некоммерческая организация «Фонд капитального ремонта многоквартирных домов Сахалинской области» http://fkr65.ru',
        destroyed: 2,
        settlement: {
          data: {
            id: 16,
            latitude: 51.535556,
            longitude: 142.753611,
            population: 473,
            translation: {
              data: {
                locale: 'ru',
                area: 'МО ГО "Ногликский"',
                title: 'с. Ныш',
                region: 'Сахалин'
              }
            }
          }
        }
      }
    }
  },
  {
    ep_dis: 44.36357,
    msk64_value: 6.4,
    pga_value: 10.09,
    ssi17_value: 6.9,
    delta_intensity: 0.9,
    damage_level: 3,
    building: {
      data: {
        soil_type: 0,
        building_type: 'дом',
        lat: 51.53519,
        lon: 142.75717,
        has_residential: true,
        flats: 0,
        height: 0,
        notes: '',
        max_msk64: 6,
        max_pga: 5.1,
        deterioration: 0,
        avg_day_people: 0,
        avg_night_people: 0,
        street: 'ул.Первомайская',
        street_number: '7',
        fabric_type: '',
        building_base_type: '',
        apartments_num: 8,
        built_year: 1965,
        residents: 0,
        vs30: 300,
        is_primary: false,
        data_source_reference: 'Некоммерческая организация «Фонд капитального ремонта многоквартирных домов Сахалинской области» http://fkr65.ru',
        destroyed: 4,
        settlement: {
          data: {
            id: 16,
            latitude: 51.535556,
            longitude: 142.753611,
            population: 473,
            translation: {
              data: {
                locale: 'ru',
                area: 'МО ГО "Ногликский"',
                title: 'с. Ныш',
                region: 'Сахалин'
              }
            }
          }
        }
      }
    }
  }
]

let eventGeneralInfo = {}

;(['0.175', '0.28', '0.7', '1.75', '4.4', '11.0', '28.0', '70.0', '110.0']).forEach((range, i) => {
  eventGeneralInfo[i + 1] = {
    range: range,
    data: [
      [
        52.82787797810757,
        143.25356870011748
      ],
      [
        52.68652757461198,
        142.6700828122146
      ],
      [
        52.69522011842126,
        142.6164202052367
      ]
    ]
  }
})

export const EVENT_GENERAL_INFO = eventGeneralInfo
