import { shallowMount } from '@vue/test-utils'
import ModalMap from '@/components/maps/ModalMap'
import apiSettings from '@/settings/api'

describe('maps/ModalMap.vue', () => {

  // wrapper.vm.$root.$options.settings.api
  const $root = {
    $options: {
      settings: {
        api: apiSettings
      }
    }
  }

  const wrapper = shallowMount(ModalMap, {
    mocks: { $root }
  })

  it('ModalMap getAllEvents', () => {

    // wrapper.vm.example()
    console.log(wrapper.vm.$root.$options)

  })

})
