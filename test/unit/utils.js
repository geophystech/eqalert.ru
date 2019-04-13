
export function mapPropDataGen(mapId)
{
  return {
    event: {
      id: `test-${mapId}-event`,
      locValues: {
        data: {
          lat: '58.651',
          lon: '142.395'
        }
      }
    },
    tab: `test-${mapId}-tab`
  }
}

export const $routerMocks = {
  $router: {
    resolve: data => {
      return { href: '' }
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

export const eventFilters = {
  datetime_max: {
    tag: 'flat-pickr-stub'
  },
  datetime_min: {
    tag: 'flat-pickr-stub'
  },
  depth_max: {
    tag: 'b-form-input-stub'
  },
  depth_min: {
    tag: 'b-form-input-stub'
  },
  has_mt: {
    tag: 'b-form-checkbox-stub'
  },
  mag_max: {
    tag: 'b-form-input-stub'
  },
  mag_min: {
    tag: 'b-form-input-stub'
  },
  lat_max: {
    tag: 'b-form-input-stub'
  },
  lat_min: {
    tag: 'b-form-input-stub'
  },
  lon_max: {
    tag: 'b-form-input-stub'
  },
  lon_min: {
    tag: 'b-form-input-stub'
  },
  rms_max: {
    tag: 'b-form-input-stub'
  },
  sta_num_min: {
    tag: 'b-form-input-stub'
  }
}
