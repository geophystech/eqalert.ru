<template>
  <div class="event-tab">
    <b-table
      hover
      outlined
      :fields="fields"
      :items="items">
      <template slot="index" slot-scope="data">{{ data.index + 1 }}</template>
      <template slot="description" slot-scope="data">
        <img src="../../assets/img/question-circle.png" alt="Описание" v-b-popover.hover.auto="data.value" />
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    props: ['event'],
    data() {
      return {
        items: [
          { parameter: 'Прогноз повреждений d-1', value: null, description: 'Разрушения неконструктивных элементов здания: обвалы частей перегородок, карнизов, фронтонов, дымовых труб. Значительные повреждения несущих конструкций: сквозные трещины в несущих стенах, значительные деформации каркаса, заметные сдвиги панелей, выкрашивание бетона в узлах каркаса. Разрушения несущих конструкций: проломы и вывалы в несущих стенах; развалы стыков и узлов каркаса; нарушение связей между частями здания; обрушение отдельных панелей перекрытия; обрушение крупных частей здания. Обрушение несущих стен и перекрытия, полное обрушение здания с потерей его формы' },
          { parameter: 'Прогноз повреждений d-2', value: null, description: 'Значительные повреждения материала и неконструктивных элементов здания, падение пластов штукатурки, сквозные трещины в перегородках, глубокие трещины в карнизах и фронтонах, выпадение кирпичей из труб, падение отдельных черепиц. Слабые повреждение несущих конструкций: тонкие трещины в несущих стенах, незначительные деформации и небольшие отколы бетона или раствора в узлах каркаса и в стыках панелей. Для ликвидации повреждений необходим капитальный ремонт зданий' },
          { parameter: 'Прогноз повреждений d-3', value: null, description: 'Разрушения неконструктивных элементов здания: обвалы частей перегородок, карнизов, фронтонов, дымовых труб. Значительные повреждения несущих конструкций: сквозные трещины в несущих стенах, значительные деформации каркаса, заметные сдвиги панелей, выкрашивание бетона в узлах каркаса. Разрушения несущих конструкций: проломы и вывалы в несущих стенах; развалы стыков и узлов каркаса; нарушение связей между частями здания; обрушение отдельных панелей перекрытия; обрушение крупных частей здания. Обрушение несущих стен и перекрытия, полное обрушение здания с потерей его формы' },
          { parameter: 'Влияние на население', value: null, description: 'Предполагаемое количество человек, находящихся в зданиях и сооружениях на которые были оказаны опасные сейсмические воздействия' },
          { parameter: 'Версия базы', value: null, description: 'Версия банка данных зданий и сооружений' },
          { parameter: 'Всего объектов', value: null, description: 'Общее количество зданий и сооружений в базе на момент землетрясения' },
          { parameter: 'Конфигурация системы', value: null, description: 'Версия конфигурации системы, которая была использована в расчетах' }
        ],
        fields: [
          { key: 'index', label: '#' },
          { key: 'parameter', label: 'Параметр' },
          { key: 'value', label: 'Значение', 'class': 'text-center' },
          { key: 'description', label: ' ', 'class': 'text-center' }
        ]
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData: function() {
        this.$http.get(this.$root.$options.settings.api.endpointEventBuildings(this.event.id))
          .then(response => {
            this.$root.$emit('onMapDataFetched', response.data.data)
            this.setData(response.data.data)
          })
          .catch(error => { console.log(error) })
      },
      setData: function(data) {
        let damageLevels = { '0': 0, '1': 0, '2': 0, '3': 0 }
        let damagedResidents = 0

        data.forEach(building => {
          damageLevels[building.damage_level.toString()] += 1
          if (building.damage_level === 3) damagedResidents += building.building.data.residents
        })

        const msk64ConfigVersion = this.$store.getters.msk64ConfigVersion
        const pgaConfigVersion = this.$store.getters.pgaConfigVersion

        this.items[0].value = damageLevels['1']
        this.items[1].value = damageLevels['2']
        this.items[2].value = damageLevels['3']
        this.items[3].value = damagedResidents
        this.items[4].value = this.$store.getters.srssDBVersion
        this.items[5].value = data.length
        this.items[6].value = `${msk64ConfigVersion} / ${pgaConfigVersion}`
      }
    },
    watch: {
      event: function() {
        this.fetchData(this.event.id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/event';
</style>
