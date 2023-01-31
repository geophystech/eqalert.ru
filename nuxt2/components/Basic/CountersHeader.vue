<template>
  <b-row class="infobar" align-v="center" no-gutters>

    <b-col class="text-center text-md-left" v-if="!$root.onMobile">
      <NuxtLink to="/sign-in" v-if="!$store.getters.user.authenticated">
        <i class="fa fa-lg fa-lock align-middle" aria-hidden="true" />
        <span>Снять ограничения данных</span>
      </NuxtLink>
    </b-col>

    <b-col cols="4" class="text-center">
      Загружено <span class="count">{{ count }}</span> событий
      <span v-if="count && !$root.onMobile">({{ startDate }} — {{ endDate }})</span>
    </b-col>

    <b-col :cols="$store.getters.user.authenticated && trainingEventsBtnShow ? 5 : 4">
      <div class="pull-right">

        <b-btn
          v-if="trainingEventsBtnShow && hasUserAccessTraningEvents()"
          :variant="showTrainingEvents ? 'event-training' : 'info'"
          :disabled="trainingEventsBtnDisabled"
          :pressed.sync="showTrainingEvents"
          id="showTraining"
          size="sm">{{ showTrainingEvents ? 'Скрыть' : 'Показать' }} учебные</b-btn>

        <MapModalMap v-if="showModalMap && count > 0" :filtersData="filtersData" />
        <BasicExportDropDown v-if="count > 0" @export2xls="export2xls" />
      </div>
    </b-col>

  </b-row>

</template>

<script>
  import apiSettings from '@/settings/api'

  export default {
    props: {
      trainingEventsBtnDisabled: false,
      trainingEventsBtnShow: false,
      showModalMap: false,
      filtersData: {},
      startDate: '',
      endDate: '',
      count: 0
    },
    data() {
      return {
        showTrainingEvents: false
      }
    },
    methods: {
      export2xls: function(request) {
        let params = Object.assign({}, this.filtersData)
        request(apiSettings.endpointEvents, Object.assign(params, {
          limit: 5000
        }))
      },
      hasUserAccessTraningEvents: function() {
        let permissions = this.$store.getters.user.permissions
        return 'reports:view_training' in permissions || 'reports' in permissions
      }
    },
    watch: {
      showTrainingEvents: function(value) {
        this.$emit('toggleTrainingEvents', value)
      },
      filtersData: function(data) {
        this.showTrainingEvents = !!parseInt(data.has_training || 0)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'assets/scss/_variables';

  .infobar {
    background-color: $color-white-2;
    border: 1px $color-gray-light solid;
    border-radius: $border-radius;
    font-size: 90%;
    margin-bottom: 3%;
    margin-top: 3%;
    min-height: 50px;
    padding-left: 2%;
    padding-right: 8px;

    .fa {
      color: $color-orange;
      padding-right: 1%;
    }

    .count {
      color: $color-blue;
      font-weight: bold;
    }
  }

</style>
