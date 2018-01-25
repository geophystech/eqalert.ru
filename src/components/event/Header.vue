<template>
  <b-row class="event-header" no-gutters>
    <b-col cols="3">
      <b-breadcrumb :items="breadcrumbs" />
    </b-col>
    <b-col cols="8">
      <b-row>
        <b-col class="text-center">
          <Spinner line-fg-color="#337ab7" :line-size="1" size="26" v-show="!event.magnitude" />

          <h5 v-show="event.magnitude">
            <span class="magnitude-type" v-for="item in event.magnitudeType" :key="item[0]">
              <span>{{ item[0] }}</span><small>{{ item[1] }}</small>
            </span>
            ( <span class="magnitude">{{ event.magnitude }}</span> )
            {{ moment.utc(event.datetime).locale('ru').format('LL в HH:mm:ss UTC') }}
            <span class="processing-method">
              {{ event.processingMethod.short }}
            </span>
          </h5>
        </b-col>
      </b-row>

      <b-row v-show="event.magnitude">
        <b-col class="text-center">
          <b-badge
            :variant="label.variant"
            v-b-popover.hover.auto="label.description">
              {{ label.text }}
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
</template>

<script>
  const moment = require('moment')
  require('moment/locale/ru')

  import Spinner from 'vue-simple-spinner'

  export default {
    components: { Spinner },
    props: ['event'],
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
            text: 'event',
            active: true
          }
        ],
        label: {}
      }
    },
    methods: {
      setLabel: function(event) {
        if (event.has_delete) {
          this.label = {
            description: 'Информация о землетрясении удалена из итогового каталога сейсмических событий',
            text: 'СОБЫТИЕ УДАЛЕНО',
            variant: 'deleted'
          }
        } else if (event.has_final) {
          this.label = {
            description: 'Информация о землетрясении проверена и зарегистрирована в итоговом каталоге сейсмических событий',
            text: 'ФИНАЛЬНЫЙ РАСЧЁТ',
            variant: 'final'
          }
        } else {
          this.label = {
            description: 'Информация о землетрясении уточняется',
            text: 'РАСЧЁТ ОБНОВЛЯЕТСЯ',
            variant: 'processing'
          }
        }
      }
    },
    computed: {
      moment: function() {
        return moment
      }
    },
    created() {
      this.setLabel(this.event)
    },
    watch: {
      event: function(value) {
        this.breadcrumbs[2].text = value.id
        this.setLabel(value.id)
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/global';

  .event-header {
    margin-bottom: 3%;
    margin-top: 4%;

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

    .badge-deleted {
      background-color: $color-red;
      color: $color-white;
    }

    .badge-final {
      background-color: $color-green;
      color: $color-white;
    }

    .badge-processing {
      background-color: $color-orange;
      color: $color-white;
    }

    .magnitude {
      color: $color-orange;
    }

    .processing-method {
      color: $color-blue;
    }
  }
</style>
