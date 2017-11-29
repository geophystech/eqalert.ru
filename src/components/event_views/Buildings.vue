<template>
  <div class="event-tab buildings">
    <AppMap :hashid="hashid" mapId="map-buildings" shouldDrawEpicenter="true" shouldDrawBuildings="true" target="buildings" />

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
import AppMap from '@/components/AppMap'

export default {
  components: { AppMap },
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
  computed: {
    hashid: function() {
      return 'KEXKBvM0'
    }
  },
  created() {
    this.getBuildings()
  },
  methods: {
    getBuildings: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/ec3b73cb31ece1eedc4c5a86f211e0a8/raw/06781dda471ae3258dde551f17ec525fc38b41e8/eq_QgpAn7OW_buildings.json')
        .then(response => {
          const msk64ConfigVersion = response.data.system_info.msk64_config_version
          const pgaConfigVersion = response.data.system_info.pga_config_version

          this.items[0].value = response.data.buildings_information.damage_level_1
          this.items[1].value = response.data.buildings_information.damage_level_2
          this.items[2].value = response.data.buildings_information.damage_level_3
          this.items[3].value = response.data.buildings_information.damaged_resindents
          this.items[4].value = response.data.system_info.srss_db_version
          this.items[5].value = response.data.buildings_information.buildings_count
          this.items[6].value = `${msk64ConfigVersion} / ${pgaConfigVersion}`
        })
        .catch(error => { console.log(error) })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/event.scss';
</style>
