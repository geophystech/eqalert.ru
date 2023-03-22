export default {
  async asyncData({ $axios, $moment, $api }) {
    const params = {
      include: 'nearestCity',
      cursor: '',
      limit: 10,
      datetime_min: $moment.utc().subtract(3, 'months').format('YYYY-MM-DD 00:00:00')
    }

    let { data } = await $axios.get($api.endpointEvents, { params })

    const events = data.data

    return { events }
  }
}
