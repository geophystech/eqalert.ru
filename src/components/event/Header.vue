<template>
  <b-row class="event-header" no-gutters>
    <b-col cols="12" md="3">
      <b-breadcrumb :items="breadcrumbs" />
    </b-col>
    <b-col cols="12" md="8">
      <b-row>
        <b-col class="text-center">
          <Spinner line-fg-color="#337ab7" :line-size="1" size="26" v-if="!event.magnitude" />

          <h5 v-if="event.magnitude">
            <span class="magnitude-type" v-for="item in event.magnitudeType" :key="item[0]">
              <span>{{ item[0] }}</span><small>{{ item[1] }}</small>
            </span>
            ( <span class="magnitude">{{ event.magnitude }}</span> )
            {{ event.datetime | moment(datetimeFormat) }}
            <span class="processing-method">
              {{ event.processingMethod.short }}
            </span>
            <b-badge v-if="agency.title" class="agency" v-b-popover.hover.auto="agency.description">
              {{ agency.title }}
            </b-badge>
          </h5>
        </b-col>
      </b-row>

      <b-row v-if="event.magnitude">
        <b-col class="text-center">
          <b-badge
            :variant="label.variant"
            v-b-popover.hover.auto="label.description">
              {{ label.text }}
          </b-badge>
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="1" md="1" class="text-right" v-if="!$root.onMobile">
      <b-button-group>
        <b-dropdown right text="Скачать" size="sm" variant="secondary">
          <b-dropdown-item>Скачать в формате XLS</b-dropdown-item>
        </b-dropdown>
      </b-button-group>
    </b-col>
  </b-row>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import { agency, agencyDescription } from '@/helpers/event'

  export default {
    components: { Spinner },
    props: ['event'],
    data() {
      return {
        agency: {
          title: '',
          description: ''
        },
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
      setAgency: function(data) {
        this.agency.title = agency(data, false)
        this.agency.description = agencyDescription(data)
      },
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
      datetimeFormat: function() {
        if (this.$root.onMobile) {
          return 'L в HH:mm:ss UTC'
        } else {
          return 'LL в HH:mm:ss UTC'
        }
      }
    },
    created() {
      this.setLabel(this.event)
    },
    watch: {
      event: function(value) {
        this.breadcrumbs[2].text = value.id
        this.setLabel(value)
        this.setAgency(value.agency)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~scss/global';

  .event-header {
    margin-bottom: 3%;
    margin-top: 4%;

    .breadcrumb {
      background-color: transparent;
      padding-left: 0;
      padding-top: 0;

      .active {
        color: $color-gray-dark;
      }
    }

      .agency {
        @media screen and (min-width: 768px) {
          font-size: 50% !important;
          vertical-align: top;
        }
      }


    .badge {
      font-size: 70%;
      padding: 1%;
      text-transform: uppercase;

      @media screen and (max-width: 767px) {
        padding: 2%;
      }
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
