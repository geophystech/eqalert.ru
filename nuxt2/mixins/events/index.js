import apiSettings from "@/settings/api";

export default {
  async asyncData({ $axios, $moment }) {
    const params = {
      include: 'nearestCity',
      cursor: '',
      limit: 10,
      datetime_min: $moment.utc().subtract(6, 'months').format('YYYY-MM-DD 00:00:00')
    }

    let { data } = await $axios.get(apiSettings.endpointEvents, { params })

    const events = data.data

    return { events }
  }
}
