import { shallowMount } from '@vue/test-utils'
import ModalMap from '@/components/maps/ModalMap'
import axios from 'axios'

describe('maps/ModalMap.vue', () => {

  const wrapper = shallowMount(ModalMap, {
    mocks: {
      $http: axios
    }
  })

  it('ModalMap button click', () => {

    // wrapper.find('#map-dialog-btn').trigger('click')

    console.log(wrapper.find('#map-dialog-btn').exists())
    console.log(wrapper.find('#map-dialog-btn').name())
    console.log(wrapper.find('#map-dialog-btn').classes())

  })

})
