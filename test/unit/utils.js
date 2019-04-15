
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
