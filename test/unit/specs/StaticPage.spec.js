import { shallowMount, createLocalVue } from '@vue/test-utils'
import StaticPage from '@/components/StaticPage'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'
import $moment from 'moment'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const PAGE_CONTENT = 'Page content'
const DEFAULT_PAGE = 'about'

const $http = {
  get: () => Promise.resolve({
    response: {
      data: PAGE_CONTENT
    }
  })
}

const $router = {
  currentRoute: {
    params: {
      page: DEFAULT_PAGE
    }
  }
}

function createWrapper()
{
  return shallowMount(StaticPage, {
    mocks: { $moment, $http, $router },
    propsData: {
      pages: { [DEFAULT_PAGE]: 'About' },
      // page: DEFAULT_PAGE,
      content: ''
    },
    localVue
  })
}

describe('StaticPage.vue', () => {

  ([
    ['Request page before route update', wrapper => {
      const beforeRouteUpdate = wrapper.vm.$options.beforeRouteUpdate[0]
      beforeRouteUpdate.apply(wrapper.vm, [$router.currentRoute, null, () => {}])
    }],
    ['Request page default', wrapper => {

    }]
  ]).forEach(conf => {

    const wrapper = createWrapper()
    const [label, mod] = conf

    it(label, async () => {
      mod(wrapper)
      flushPromises().then(() => {
        expect(wrapper.vm.content).to.equal(PAGE_CONTENT)
      })
    })

  })

})
