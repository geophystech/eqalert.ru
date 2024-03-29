<template>

  <b-row class="event-header" no-gutters>

    <ClientOnly>
      <b-col cols="11" md="3">
        <b-breadcrumb :items="breadcrumbs" />
      </b-col>
    </ClientOnly>

    <b-col cols="12" md="8">
      <b-row>
        <b-col class="text-center">
          <ClientOnly>
            <Spinner v-if="!event.magnitude && !!event.id" />
          </ClientOnly>

          <h5 v-if="event.magnitude">
            <span class="magnitude-type" v-for="item in event.magnitudeType" :key="item[0]">
              <span>{{ item[0] }}</span><small>{{ item[1] }}</small>
            </span>
            ( <span class="magnitude">{{ event.magnitude }}</span> )
            {{ $moment(event.datetime).format(datetimeFormatUTC) }}
            <span class="processing-method">
              {{ event.processingMethod.short }}
            </span>
            <b-badge v-if="agency.title" class="agency" v-b-popover.hover.auto="agency.description">
              {{ agency.title }}
            </b-badge>
          </h5>

        </b-col>
      </b-row>

      <b-row class="event-local-dt-row">
        <b-col class="text-center">
          <span class="event-datetime"
                v-b-popover.hover.auto="'Время землетрясения в вашем часовом поясе'">
              {{ localDateTime(event.datetime) }}
            </span>
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

      <b-row class="event-local-dt-row mt-2">
        <b-col class="text-center font-weight-bolder">
          <NuxtLink
            :to="{ name: 'felt-report', query: { reportId: event.id } }"
          >Ощутили это землетрясение?</NuxtLink>
        </b-col>
      </b-row>

    </b-col>

    <ClientOnly>
      <b-col cols="1" md="1" class="text-right" v-if="!onMobile">
        <b-button-group>
          <BasicExportDropDown v-if="event.id" @export2xls="export2xls" />
        </b-button-group>
      </b-col>
    </ClientOnly>

  </b-row>

</template>

<script>
  import { agency, agencyDescription } from '@/helpers/event'
  import onMobile from "@/mixins/onMobile";

  export default {
    props: {
      event: {}
    },
    mixins: [onMobile],
    components: {
      Spinner: () => (process.client) ? import('@/components/Basic/Spinner.vue') : null,
    },
    data() {
      return {
        agency: { title: '', description: '' },
        label: {}
      }
    },
    methods: {
      setAgency: function(data) {
        this.agency.title = agency(data, false)
        this.agency.description = agencyDescription(data)
      },
      localDateTime: function(dt) {
        return this.$moment.utc(dt).local().format(this.datetimeFormatLocal)
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
      },
      export2xls: function(request) {
        request(this.$api.endpointEvent(this.event.id))
      }
    },
    computed: {
      datetimeFormatUTC: function() {
        return this.onMobile ? 'L в HH:mm:ss UTC' : 'LL в HH:mm:ss UTC'
      },
      datetimeFormatLocal: function() {
        return this.onMobile ? 'L в HH:mm:ss (UTCZ)' : 'LL в HH:mm:ss (UTCZ)'
      },
      breadcrumbs: function()
      {
        let breadcrumbs = []

        breadcrumbs.push({
          text: 'Главная',
          href: "/"
        })

        if (!this.onMobile)
        {
          let query = JSON.parse(this.$route.query.backUrlQuery || '{}')

          breadcrumbs.push({
            text: 'События',
            href: this.$router.resolve({ name: 'events', query }).href
          })
        }

        breadcrumbs.push({
          text: this.event.id || 'event',
          active: true
        })

        return breadcrumbs
      }
    },
    created() {
      this.setLabel(this.event)
    },
    watch: {

      event: function(value)
      {
        this.breadcrumbs[ this.breadcrumbs.length - 1 ].text = value.id
        this.setLabel(value)
        this.setAgency(value.agency)
      }

    }
  }
</script>

<style lang="scss">
  .popover {
    max-width: 450px;
  }
</style>

<style lang="scss" scoped>
  @import 'assets/scss/_variables';

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
      padding: 8px;
      text-transform: uppercase;

      @media screen and (max-width: 767px) {
        padding: 2%;
      }

      &.agency {
        cursor: pointer;
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
      cursor: pointer;
    }

    .magnitude {
      color: $color-orange;
    }

    .processing-method {
      color: $color-blue;
    }

    .event-local-dt-row
    {
      margin-bottom: 12px;

      .event-datetime
      {
        border-bottom: 1px dashed;
        color: #9E9E9E;
        cursor: help;

        &:hover {
          border-bottom-color: transparent;
        }
      }
    }
  }
</style>
