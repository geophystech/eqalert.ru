<template>
  <div class="event">
    <b-row class="event-header" no-gutters>
      <b-col cols="3"><b-breadcrumb :items="breadcrumbs" /></b-col>
      <b-col cols="8">
        <b-row>
          <b-col class="text-center">
            <h5>
              <span class="magnitude-type" v-for="item in event.magnitudeType" :key="item[0]">
                <span>{{ item[0] }}</span><small>{{ item[1] }}</small>
              </span>
              ( <span class="magnitude">{{ event.magnitude }}</span> )
              {{ event.datetime }}
              <span class="processing-method">{{ event.processingMethod }}</span>
            </h5>
          </b-col>
        </b-row>

        <b-row>
          <b-col class="text-center">
            <b-badge
              variant="final"
              v-b-popover.hover.auto="'Информация о землетрясении проверена и зарегистрирована в итоговом каталоге сейсмических событий'">
                ФИНАЛЬНЫЙ РАСЧЁТ
            </b-badge>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="1" class="text-right">
        <b-button-group>
          <b-dropdown right text="Скачать" size="sm" variant="secondary">
            <b-dropdown-item>Скачать в формате XLS</b-dropdown-item>
          </b-dropdown>
        </b-button-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
const moment = require('moment')
require('moment/locale/ru')

export default {
  name: 'event',
  data() {
    return {
      breadcrumbs: [
        {
          text: 'Главная',
          href: this.$router.resolve({ name: 'Mainpage' }).href
        }, {
          text: 'События',
          href: this.$router.resolve({ name: 'Events' }).href
        }, {
          text: this.$router.currentRoute.params.hashid,
          active: true
        }],
      event: {
        datetime: '',
        hashid: '',
        magnitude: '4.5',
        magnitudeType: [['M', 'L']],
        processingMethod: 'M'
      }
    }
  },
  methods: {
    getEvent: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/b090c866778c02ddd63c5dc1667317f9/raw/a41ec3cd01d380d553cf1655a16d10a56d5c7979/eq_KEXKBvM0_general_information.json')
        .then(response => {
          this.event.datetime = moment.utc(response.data.event.datetime).locale('ru').format('LL в HH:mm:ss UTC')
        })
        .catch(error => { console.log(error) })
    },
    convertMagnitudeType: function(type) {
      switch (type) {
        case 'L':
          this.event.magnitudeType.push(['M', 'L'])
          break
        case 'b':
          this.event.magnitudeType.push(['m', 'b'])
          break
        case 'B':
          this.event.magnitudeType.push(['m', 'B'])
          break
        case 's':
          this.event.magnitudeType.push(['M', 's'])
          break
        case 'S':
          this.event.magnitudeType.push(['M', 'S'])
          break
        case 'W':
          this.event.magnitudeType.push(['M', 'W'])
          break
        case 'G':
          this.event.magnitudeType.push(['M', 'b'])
          this.event.magnitudeType.push(['L', 'g'])
          break
        case 'C':
          this.event.magnitudeType.push(['M', 'c'])
          break
        default:
          this.event.magnitudeType.push(['M', ''])
      }
    }
  },
  created() {
    this.event.hashid = this.$router.currentRoute.params.hashid
    this.getEvent()
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/scss/global.scss';

  .event-header {
    margin-top: 2%;

    .breadcrumb {
      background-color: transparent;
      padding-left: 0;
      padding-top: 0;

      .active {
        color: #444;
      }
    }

    .badge {
      font-size: 70%;
      padding: 1%;
      text-transform: uppercase;
    }

    .badge-final {
      background-color: $color-green;
    }
    .magnitude {
      color: $color-orange;
    }

    .processing-method {
      color: $color-blue;
    }
  }
</style>
