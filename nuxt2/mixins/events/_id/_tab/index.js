import apiSettings from "@/settings/api";
import {round} from "@/helpers/math";

export default {
  async asyncData({ $axios, store, route, $moment }) {
    const eventId = route.params.id
    let { data, status } = await $axios.get(apiSettings.endpointEvent(eventId), {
      params: { include: 'nearestCity' }
    })

    if (status === 200)
    {
      const magnitudeType = function(type)
      {
        // Nested arrays are used because there may be multiple magnitude types.
        // But in most cases there will be only one type.
        switch (type) {
          case 'L': return [['M', 'L']]
          case 'b': return [['m', 'b']]
          case 'B': return [['m', 'B']]
          case 's': return [['M', 's']]
          case 'S': return [['M', 'S']]
          case 'W': return [['M', 'W']]
          case 'G': return [['M', 'b'], ['L', 'g']]
          case 'C': return [['M', 'c']]
          case 'mww': return [['M', 'mww']]
          default: return [['M', '']]
        }
      }

      const processingMethod = function(auto, manual)
      {
        if (auto && !manual) return { long: 'автоматический', short: 'A' }
        if (auto && manual) return { long: 'смешанный', short: 'AM' }
        if (!auto && manual) return { long: 'ручной', short: 'M' }

        return { long: 'неизвестно', short: 'U' }
      }

      const getTitle = function(event, moment) {
        const magnitude = `Землетрясение M${event.magnitude}`
        let settlement = ``

        if (event.nearestCity) {
          const distance = round(event.nearestCity.data.ep_dis, 2)
          const title = event.nearestCity.data.settlement.data.translation.data.title
          const region = event.nearestCity.data.settlement.data.translation.data.region
          settlement = `${distance} км до ${title}, ${region}`
        }

        const date = moment(event.datetime).format('LL в HH:mm:ss UTC')

        return `${magnitude} ${date} ${settlement}`
      }

      if(!store.getters['user/user'].authenticated)
      {
        let event = data.data

        event.has_long_distance_objects_analysis = false
        event.has_buildings_msk64_analysis = false

        event.datetime = data.data.locValues.data.event_datetime
        event.magnitude = data.data.locValues.data.mag.toFixed(1)
        event.magnitudeType = magnitudeType(data.data.locValues.data.mag_t)
        event.processingMethod = processingMethod(data.data.has_auto, data.data.has_manual)

        return { event, headTitle: getTitle(event, $moment) }
      }
      else
      {
        const accessToken = store.getters['user/user'].accessToken

        $axios.defaults.headers.common['Authorization'] = `${apiSettings.authorizationType} ${accessToken}`

        let buildingsRequest = await $axios.get(apiSettings.endpointEventBuildings(eventId))

        let ldosRequest = await $axios.get(apiSettings.endpointEventLDOs(eventId), {
          params: { customer_ids: [1], show_all_parts: 1 }
        })

        if (buildingsRequest.status === 200 && ldosRequest.status === 200) {
          let event = data.data
          let buildings = buildingsRequest.data.data
          let ldos = ldosRequest.data.data

          buildings = buildings.filter(building => building.damage_level || building.building.data.destroyed)

          event.has_long_distance_objects_analysis = (event.has_long_distance_objects_analysis && ldos.length > 0)
          event.has_buildings_msk64_analysis = (event.has_buildings_msk64_analysis && buildings.length > 0)

          event.datetime = data.data.locValues.data.event_datetime
          event.magnitude = data.data.locValues.data.mag.toFixed(1)
          event.magnitudeType = magnitudeType(data.data.locValues.data.mag_t)
          event.processingMethod = processingMethod(data.data.has_auto, data.data.has_manual)

          return { event, headTitle: getTitle(event, $moment) }
        }
      }
    }
  }
}
