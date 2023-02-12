import apiSettings from "@/settings/api";

export default {
  async asyncData({ $axios }) {
    const params = {
      include: 'nearestCity',
      cursor: '',
      limit: 10
    }

    let { data } = await $axios.get(apiSettings.endpointEvents, { params })

    const events = data.data

    return { events }
  }
}
