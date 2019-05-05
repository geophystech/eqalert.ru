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

describe('StaticPage.vue', () => {

  const wrapper = shallowMount(StaticPage, {
    mocks: { $moment, $http, $router },
    propsData: {
      pages: { [DEFAULT_PAGE]: 'About' },
      // page: DEFAULT_PAGE,
      content: ''
    },
    localVue
  })

  it('Request page', async () => {
    flushPromises().then(() => {
      expect(wrapper.vm.content).to.equal(PAGE_CONTENT)
    })
  })

})
