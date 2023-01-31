<template>
  <div class="event-tab">
    <ClientOnly>
      <Spinner v-if="spinner" />
    </ClientOnly>

    <b-table hover outlined responsive :fields="fields" :items="items" v-if="!spinner">
      <template slot="index" slot-scope="data">{{ data.index + 1 }}</template>
      <template slot="description" slot-scope="data">
        <img src="/img/question-circle.png" alt="Описание"
             v-if="!!data.value" v-b-popover.hover.right="data.value" />
      </template>
    </b-table>
  </div>
</template>

<script>
import apiSettings from '@/settings/api'

export default {
  props: ['event'],
  components: {
    Spinner: () => (process.client) ? import('@/components/Basic/Spinner.vue') : null,
  },
  data() {
    return {
      items: [
        { parameter: 'Прогноз повреждений M1', description: '', value: 0 },
        { parameter: 'Прогноз повреждений M2', description: '', value: 0 },
        { parameter: 'Прогноз повреждений M3', description: '', value: 0 },
        { parameter: 'Прогноз повреждений M4', description: '', value: 0 },
        { parameter: 'Прогноз повреждений M5', description: '', value: 0 },
        {
          parameter: 'Необходимы инспекционные работы',
          description: '',
          value: 0
        },
        {
          parameter: 'Версия базы',
          description: 'Версия банка данных зданий и сооружений',
          value: null
        },
        {
          parameter: 'Всего магистральных объектов',
          description: 'Общее количество зданий и сооружений в базе на момент землетрясения',
          value: null
        },
        {
          parameter: 'Конфигурация системы',
          description: 'Версия конфигурации системы, которая была использована в расчетах',
          value: null
        }
      ],
      fields: [
        { key: 'index', label: '#' },
        { key: 'parameter', label: 'Параметр' },
        { key: 'value', label: 'Значение', 'class': 'text-center' },
        { key: 'description', label: ' ', 'class': 'text-center' }
      ],
      spinner: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData: function() {
      this.$axios.get(apiSettings.endpointEventLDOs(this.event.id), {
        params: {
          customer_ids: [1], // Change id(s) when the user management is implemented.
          show_all_parts: 1
        }
      })
        .then(response => {
          this.$root.$emit('onMapLDOsDataFetched', response.data.data)
          this.setData(response.data.data)
        })
    },
    setData: function(data) {
      const damagedParts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

      data.forEach(ldo => {
        ldo.parts.data.forEach(part => {
          if (part.damage && part.damage.data.damage_level > 0) {
            damagedParts[part.damage.data.damage_level] += 1
          }
        })
      })

      Object.keys(damagedParts).forEach((k, i) => {
        this.items[i].value = damagedParts[k]
      })

      this.items[5].value = 0;

      ([2, 3, 4, 5]).forEach(level => {
        this.items[5].value += damagedParts[level]
      })

      this.items[6].value = this.$store.getters.srssDBVersion
      this.items[7].value = data.length
      this.items[8].value = this.$store.getters.msk64ConfigVersion

      this.spinner = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'assets/scss/event';
</style>
