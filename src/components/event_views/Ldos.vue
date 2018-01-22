<template>
  <div class="event-tab ldos">
    <AppMap :event="event" mapId="map-ldos" shouldDrawEpicenter="true" shouldDrawLDOs="true" target="ldos" v-if="event.id" />

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
  props: ['id'],
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
      ]
    }
  },
  created() {
    this.getLDOs()
  },
  methods: {
    getLDOs: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/d11aa34f71ae59da19f0a59379f0c0cd/raw/0949a047792fc84a346aa420848e0761d8609a59/eq_QgpAn7OW_ldos.json')
        .then(response => {
          const msk64ConfigVersion = response.data.system_info.msk64_config_version
          const pgaConfigVersion = response.data.system_info.pga_config_version
          const damagedSum = response.data.damaged_count.level_1 + response.data.damaged_count.level_2

          this.items[0].value = response.data.damaged_count.level_1
          this.items[1].value = response.data.damaged_count.level_2
          this.items[2].value = response.data.damaged_count.level_3
          this.items[3].value = damagedSum
          this.items[4].value = response.data.system_info.srss_db_version
          this.items[5].value = response.data.ldos.length
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
