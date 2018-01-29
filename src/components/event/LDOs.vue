<template>
  <div class="event-tab">
    <Spinner line-fg-color="#337ab7" :line-size="1" size="26" v-if="spinner" />

    <b-table
      hover
      outlined
      :fields="fields"
      :items="items"
      v-if="!spinner">
      <template slot="index" slot-scope="data">{{ data.index + 1 }}</template>
      <template slot="description" slot-scope="data">
        <img src="../../assets/img/question-circle.png" alt="Описание" v-b-popover.hover.auto="data.value" />
      </template>
    </b-table>
  </div>
</template>

<script>
import AppMap from '@/components/AppMap'
import Spinner from 'vue-simple-spinner'

export default {
  components: { AppMap, Spinner },
  props: ['event'],
  data() {
    return {
      items: [
        { parameter: 'Прогноз повреждений M1', value: null, description: 'Разрушения неконструктивных элементов здания: обвалы частей перегородок, карнизов, фронтонов, дымовых труб. Значительные повреждения несущих конструкций: сквозные трещины в несущих стенах, значительные деформации каркаса, заметные сдвиги панелей, выкрашивание бетона в узлах каркаса. Разрушения несущих конструкций: проломы и вывалы в несущих стенах; развалы стыков и узлов каркаса; нарушение связей между частями здания; обрушение отдельных панелей перекрытия; обрушение крупных частей здания. Обрушение несущих стен и перекрытия, полное обрушение здания с потерей его формы' },
        { parameter: 'Прогноз повреждений M2', value: null, description: 'Значительные повреждения материала и неконструктивных элементов здания, падение пластов штукатурки, сквозные трещины в перегородках, глубокие трещины в карнизах и фронтонах, выпадение кирпичей из труб, падение отдельных черепиц. Слабые повреждение несущих конструкций: тонкие трещины в несущих стенах, незначительные деформации и небольшие отколы бетона или раствора в узлах каркаса и в стыках панелей. Для ликвидации повреждений необходим капитальный ремонт зданий' },
        { parameter: 'Прогноз повреждений M3', value: null, description: 'Разрушения неконструктивных элементов здания: обвалы частей перегородок, карнизов, фронтонов, дымовых труб. Значительные повреждения несущих конструкций: сквозные трещины в несущих стенах, значительные деформации каркаса, заметные сдвиги панелей, выкрашивание бетона в узлах каркаса. Разрушения несущих конструкций: проломы и вывалы в несущих стенах; развалы стыков и узлов каркаса; нарушение связей между частями здания; обрушение отдельных панелей перекрытия; обрушение крупных частей здания. Обрушение несущих стен и перекрытия, полное обрушение здания с потерей его формы' },
        { parameter: 'Необходимы инспекционные работы', value: null, description: 'Предполагаемое количество человек, находящихся в зданиях и сооружениях на которые были оказаны опасные сейсмические воздействия' },
        { parameter: 'Версия базы', value: null, description: 'Версия банка данных зданий и сооружений' },
        { parameter: 'Всего магистральных объектов', value: null, description: 'Общее количество зданий и сооружений в базе на момент землетрясения' },
        { parameter: 'Конфигурация системы', value: null, description: 'Версия конфигурации системы, которая была использована в расчетах' }
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
    addData: function(data) {
      const damagedParts = { '1': 0, '2': 0, '3': 0 }

      data.forEach(ldo => {
        ldo.parts.data.forEach(part => {
          if (!part.damage || part.damage.data.damage_level < 1) return

          damagedParts[`${part.damage.data.damage_level}`] += 1
        })
      })

      const msk64ConfigVersion = this.$store.getters.msk64ConfigVersion
      const pgaConfigVersion = this.$store.getters.pgaConfigVersion

      this.items[0].value = damagedParts['1']
      this.items[1].value = damagedParts['2']
      this.items[2].value = damagedParts['3']
      this.items[3].value = damagedParts['1'] + damagedParts['2']
      this.items[4].value = this.$store.getters.srssDBVersion
      this.items[5].value = data.length
      this.items[6].value = `${msk64ConfigVersion} / ${pgaConfigVersion}`
      this.spinner = false
    },
    fetchData: function() {
      this.$http.get(this.$root.$options.settings.api.endpointEventLDOs(this.event.id), {
        params: {
          customer_ids: [1], // Change id(s) when the user management is implemented.
          show_all_parts: 1
        }
      })
        .then(response => { this.addData(response.data.data) })
        .catch(error => { console.log(error) })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/event';
</style>
