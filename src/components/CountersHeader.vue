<template>
  <b-row class="infobar" align-v="center" no-gutters>
    <b-col md="4" class="text-center text-md-left" v-if="!$root.onMobile">
      <router-link to="/sign-in" v-if="!$store.getters.user.authenticated">
        <i class="fa fa-lg fa-lock align-middle" aria-hidden="true" />
        <span>Снять ограничения данных</span>
      </router-link>
    </b-col>
    <b-col cols="7" md="4" class="text-center">
      Загружено <span class="count">{{ count }}</span> событий
      <span v-if="count && !$root.onMobile">({{ startDate }} — {{ endDate }})</span>
    </b-col>
    <b-col cols="5" md="4">
      <div class="pull-right">
        <ModalMap v-if="showModalMap && count > 0" :filtersData="filtersData" />
        <ExportDropDown @export2xls="export2xls" />
      </div>
    </b-col>
  </b-row>
</template>

<script>
  import ModalMap from '@/components/maps/ModalMap'
  import ExportDropDown from '@/components/ExportDropDown'
  export default {
    props: {
      showModalMap: false,
      filtersData: {},
      startDate: '',
      endDate: '',
      count: 0
    },
    data() {
      return {}
    },
    components: { ModalMap, ExportDropDown },

    methods: {
      export2xls: function(callBack)
      {
        this.$http.get(this.$root.$options.settings.api.endpointEvents, {
          params: Object.assign(Object.assign({}, this.filtersData), {
            include: 'nearestCity',
            export_to: 'xlsx',
            limit: 5000
          })
        })
          .then(response => {
            callBack(response.data.data.url)
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~scss/global';

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
