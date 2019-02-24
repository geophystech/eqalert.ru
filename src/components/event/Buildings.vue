<template>
  <div class="event-tab">
    <b-table hover outlined responsive :fields="fields" :items="items">
      <template slot="index" slot-scope="data">{{ data.index + 1 }}</template>
      <template slot="description" slot-scope="data">
        <img v-if="data.value" src="../../assets/img/question-circle.png" alt="Описание" v-b-popover.hover.right="data.value" />
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    props: ['event'],
    data() {
      return {
        fields: [
          { key: 'index', label: '#' },
          { key: 'parameter', label: 'Параметр' },
          { key: 'value', label: 'Значение', 'class': 'text-center' },
          { key: 'description', label: ' ', 'class': 'text-center' }
        ],
        items: [
          {
            parameter: 'Прогноз повреждений d-0',
            value: 0,
            description: 'Отсутствие расчётных повреждений. Сотрясение здания: сыплется пыль из щелей, осыпаются чешуйки побелки.'
          },
          {
            parameter: 'Прогноз повреждений d-1',
            value: 0,
            description: 'Слабые расчётные повреждения. Высокая вероятность слабых повреждений отделки ' +
              'и ненесущих элементов здания или сооружения: тонкие трещины в штукатурке; ' +
              'откалывание небольших кусков штукатурки; тонкие трещины в сопряжениях перекрытий со стенами ' +
              'и стенового заполнения с элементами каркаса, между панелями, в разделке печей и дверных коробок, ' +
              'тонкие трещины в перегородках, карнизах. фронтонах, трубах. ' +
              'Видимые повреждения конструктивных элементов отсутствуют. ' +
              'Работоспособное техническое состояние по ГОСТ 31937'
          },
          {
            parameter: 'Прогноз повреждений d-2',
            value: 0,
            description: 'Слабые расчётные повреждения. Высокая вероятность слабых повреждений отделки ' +
              'и ненесущих элементов здания или сооружения: трещины в штукатурке; откалывание небольших кусков штукатурки; ' +
              'трещины в сопряжениях перекрытий со стенами и стенового заполнения с элементами каркаса, между панелями, ' +
              'в разделке печей и дверных коробок, трещины в перегородках, карнизах, фронтонах, трубах. ' +
              'Видимые повреждения конструктивных элементов отсутствуют. ' +
              'Ограниченно работоспособное техническое состояние по ГОСТ 31937'
          },
          {
            parameter: 'Прогноз повреждений d-3',
            value: 0,
            description: 'Серьезные расчётные повреждения. Высокая вероятность повреждений отделки и несущих элементов ' +
              'здания или сооружения: трещины в штукатурке; откалывание небольших кусков штукатурки; трещины в сопряжениях ' +
              'перекрытий со стенами и стенового заполнения с элементами каркаса, между панелями, в разделке печей ' +
              'и дверных коробок; трещины в перегородках, карнизах, фронтонах, трубах. ' +
              'Видимые повреждения конструктивных элементов. Аварийное состояние по ГОСТ 31937'
          },
          {
            parameter: 'Прогноз повреждений d-4',
            value: 0,
            description: 'Значительные расчётные повреждения. Высокая вероятность значительных повреждений несущих ' +
              'элементов здания или сооружения: глубокие трещины в карнизах и фронтонах, падение дымовых труб. ' +
              'Высокая вероятность значительных деформаций и больших отколов бетона или раствора ' +
              'в узлах каркаса и в стыках панелей. Здание под снос.'
          },
          {
            parameter: 'Прогноз повреждений d-5',
            value: 0,
            description: 'Разрушение по данным расчётов. Высокая вероятность обрушения несущих стен и перекрытия, ' +
              'полного обрушения здания или сооружения с потерей его формы.'
          },
          {
            parameter: 'Ранее повреждённые объекты',
            value: 0,
            description: 'Количество зданий на которые было оказано опасное сейсмическое воздействие от предыдущих землетрясений.'
          },
          {
            parameter: 'Версия базы',
            value: null,
            description: 'Версия банка данных зданий и сооружений'
          },
          {
            parameter: 'Всего объектов',
            value: null,
            description: 'Общее количество зданий и сооружений в базе на момент землетрясения'
          },
          {
            parameter: 'Конфигурация системы',
            value: null,
            description: 'Версия конфигурации системы, которая была использована в расчетах'
          }
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
            this.$root.$emit('onMapBuildingsDataFetched', response.data.data)
            this.setData(response.data.data)
          })
          .catch(error => { console.log(error) })
      },
      setData: function(buildings) {
        let itemsLen = this.items.length
        let damageLevels = Array.from({ length: itemsLen - 3 }, () => 0)
        let destroyed = 0

        buildings.forEach(building => {
          damageLevels[building.damage_level] += 1
          if(building.building.data.destroyed > building.damage_level) {
            destroyed++
          }
        })

        console.log(destroyed, this.items[itemsLen - 4].parameter)

        damageLevels.forEach((v, _level) => { this.items[_level].value = v })
        this.items[itemsLen - 4].value = destroyed
        this.items[itemsLen - 3].value = this.$store.getters.srssDBVersion
        this.items[itemsLen - 2].value = buildings.length
        this.items[itemsLen - 1].value = `${this.$store.getters.msk64ConfigVersion}`
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
  @import '~scss/event';
</style>
