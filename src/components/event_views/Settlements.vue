<template>
  <div class="event-tab settlements">
    <AppMap :event="event" mapId="map-settlements" shouldDrawEpicenter="true" shouldDrawMsk64="true" target="settlements" v-if="event.id" />

    <b-table
      hover
      outlined
      :fields="fields"
      :items="items"
      >
      <template slot="index" slot-scope="data">{{ data.index + 1 }}</template>
      <template slot="distance" slot-scope="data">{{ data.value }} км</template>
      <template slot="msk64" slot-scope="data">
        <b-badge :variant="data.value">{{ data.value }}</b-badge>
      </template>
      <template slot="description" slot-scope="data">
        <img src="../../assets/img/question-circle.png" alt="Описание" v-b-popover.hover.auto="data.value" />
      </template>
    </b-table>
  </div>
</template>

<script>
import AppMap from '@/components/AppMap'
import { convertMsk64, round } from '@/helpers.js'

export default {
  components: { AppMap },
  props: ['event'],
  data() {
    return {
      cursor: '',
      items: [],
      fields: [
        { key: 'index', label: '#' },
        { key: 'settlement', label: 'Населённый пункт' },
        { key: 'distance', label: 'Расстояние', 'class': 'text-center' },
        { key: 'msk64', label: 'MSK64', 'class': 'text-center' },
        { key: 'description', label: ' ', 'class': 'text-center' }
      ]
    }
  },
  created() {
    this.getSettlements()
  },
  methods: {
    description: function(value) {
      switch (value) {
        case 'I':
        case 'I-II':
          return 'Интенсивность колебаний лежит ниже предела чувствительности людей; сотрясение почвы обнаруживаются и регистрируются только сейсмографами.'
        case 'II':
        case 'II-III':
          return 'Колебания ощущаются только отдельными людьми, находящимися в покое внутри помещений, особенно на верхних этажах.'
        case 'III':
        case 'III-IV':
          return 'Землетрясения ощущаются немногими людьми, находящимися внутри помещений; под открытым небом только в благоприятных условиях. Колебания схожи с сотрясением, создаваемым проезжающим легким грузовиком. Внимательные наблюдатели замечают легкое раскачивание висячих предметов, несколько более сильное на верхних этажах.'
        case 'IV':
        case 'IV-V':
          return 'Землетрясение ощущается внутри зданий многими людьми; под открытым небом - немногими. Кое-где спящие просыпаются, но никто не пугается. Колебания схожи с сотрясением, создаваемым проезжающим тяжело нагруженным грузовиком. Дребезжание окон, дверей, посуды. Скрип полов и стен. Начинается дрожание мебели. Висячие предметы слегка раскачиваются. Жидкость в открытых сосудах слегка колеблется. В стоящих на месте автомашинах толчок заметен.'
        case 'V':
        case 'V-VI':
          return 'Землетрясение ощущается всеми людьми внутри помещения, под открытым небом - многими. Многие спящие просыпаются. Немногие лица выбегают из помещений. Животные беспокоятся. Сотрясение здания в целом. Висячие предметы сильно качаются. Картины сдвигаются с места. В редких случаях останавливаются маятниковые часы. Некоторые неустойчивые предметы опрокидываются или сдвигаются. Незапертые двери и окна распахиваются и снова захлопываются. Из наполненных открытых сосудов в небольших количествах выплескивается жидкость. Ощущаемые колебания схожи с колебаниями, создаваемыми паданием тяжелых предметов внутри здания. В некоторых случаях меняется дебит источников. '
        case 'VI':
        case 'VI-VII':
          return 'Землетрясение ощущается большинством людей как внутри помещений, так и под открытым небом. Многие люди, находящиеся в зданиях, пугаются и выбегают на улицу. Немногие лица - теряют равновесие. Домашние животные выбегают из укрытий. В немногих случаях может разбиться посуда и другие стеклянные изделия; падают книги. Возможно движение тяжелой мебели; может быть слышен звон малых колоколов на колокольнях. В немногих случаях в сырых грунтах возможны трещины шириной до 1 см; в горных районах отдельные случаи оползней. Наблюдаются изменения дебита источников и уровня воды в колодцах.'
        case 'VII':
        case 'VII-VIII':
          return 'Большинство людей испуганы и выбегают из помещений. Многие люди с трудом удерживаются на ногах. Колебания отмечаются лицами, ведущими автомашины. Звонят большие колокола.  На поверхности воды образуются волны, вода становится мутной вследствие поднятия ила. Изменяется уровень воды в колодцах и дебит источников. В немногих случаях возникают новые или пропадают существующие источники воды. Отдельные случаи оползней на песчаных или гравелистых берегах рек.'
        case 'VIII':
        case 'VIII-IX':
          return 'Испуг и паника; испытывают беспокойство даже лица, ведущие автомашины. Кое-где обламываются ветки деревьев. Сдвигается и иногда опрокидывается тяжелая мебель. Часть висячих ламп повреждается. Небольшие оползни на крутых откосах выемок и насыпей дорог; трещины в грунтах достигают нескольких сантиметров. Возникают новые водоемы. Иногда пересохшие колодцы наполняются водой или существующие колодцы иссякают. Во многих случаях изменяется дебит источников и уровень воды в колодцах. '
        case 'IX':
        case 'IX-X':
          return 'Всеобщая паника; большие повреждения мебели. Животные мечутся и кричат. На равнинах наводнения, часто заметны наносы песка и ила. Трещины в грунтах достигают ширины 10 см, а по склонам и берегам рек - свыше 10 см; кроме того большое количество тонких трещин в грунтах. Скалы обваливаются;частые оползни и осыпания грунта. На поверхности воды большие волны.'
        case 'X':
        case 'X-XI':
          return 'Трещины в грунтах шириной несколько дециметров и в нескольких случаях - до 1 м. Параллельно руслам водных потоков появляются широкие разрывы. Осыпание рыхлых пород с крутых склонов. Возможны большие оползни на берегах рек и крутых морских побережьях. В прибрежных районах перемещаются песчаные и илистые массы; выплескивание воды в каналах, озерах, реках и.т. д. Возникают новые озера. '
        case 'XI':
        case 'X-XII':
          return 'Серьезные повреждения даже зданий хорошей постройки, мостов, плотин и железнодорожных путей; шоссейные дороги приходят в негодность, разрушение подземных трубопроводов. Значительные деформации почвы в виде широких трещин, разрывов и перемещений в вертикальном и горизонтальном направлениях; многочисленные горные обвалы. Определение интенсивности сотрясения (балльности) требуют специального исследования. '
        case 'XII':
          return 'Сильное повреждение или разрушение практически всех наземных и подземных сооружений. Радикальные изменения земной поверхности. Наблюдаются значительные трещины в грунтах с обширными вертикальными и горизонтальными перемещениями. Горные обвалы и обвалы берегов рек на больших площадях. Возникают озера, образуются водопады; изменяются русла рек. Определение интенсивности сотрясения (балльности) требует специального исследования.'
      }
    },
    getSettlements: function() {
      this.$http.get(this.$root.$options.settings.api.endpointSettlements(this.$router.currentRoute.params.hashid), {
        params: {
          cursor: this.cursor,
          limit: 10
        }
      })
        .then(response => {
          response.data.data.reverse().forEach(settlement => {
            const convertedValue = convertMsk64(settlement.msk64_value)
            const item = {
              description: this.description(convertedValue),
              distance: round(settlement.ep_dis, 2),
              msk64: convertedValue,
              settlement: [settlement.settlement.data.translation.data.title, settlement.settlement.data.translation.data.region].join(', ')
            }

            this.items.push(item)
          })
        })
        .catch(error => { console.log(error) })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/event.scss';

  $border-radius: 4px;
  $color-gray-light-4: #ebeaea;

  .badge {
    min-width: 100%;
    border: 1px solid $color-gray-light-4;
    border-radius: $border-radius;
    padding: 7% 0;
  }

  .badge-I,
  .badge-I-II {
    background-color: #fff;
    color: #000;
  }

  .badge-II,
  .badge-II-III {
    background-color: #ced8fc;
    color: #000;
  }

  .badge-III,
  .badge-III-IV {
    background-color: #b7b6fe;
    color: #000;
  }

  .badge-IV,
  .badge-IV-V {
    background-color: #a2fafc;
    color: #000;
  }

  .badge-V,
  .badge-V-VI {
    background-color: #a0f8b3;
    color: #000;
  }

  .badge-VI,
  .badge-VI-VII {
    background-color: #fbfd4b;
    color: #000;
  }

  .badge-VII,
  .badge-VII-VIII {
    background-color: #fbd64b;
    color: #000;
  }

  .badge-VIII,
  .badge-VIII-IX {
    background-color: #fbb04b;
    color: #000;
  }

  .badge-IX,
  .badge-IX-X {
    background-color: #fb4b4b;
    color: #fff;
  }

  .badge-X,
  .badge-X-XI {
    background-color: #d44a4a;
    color: #fff;
  }

  .badge-XI,
  .badge-XI-XII {
    background-color: #a24b4b;
    color: #fff;
  }

  .badge-XII {
    background-color: #754b4b;
    color: #fff;
  }
</style>
