<template>
  <b-row class="infobar" align-v="center" no-gutters>
    <b-col cols="2" md="2" class="text-center text-md-left">
      <router-link to="/sign-in" v-if="!$store.getters.user.authenticated">
        <i class="fa fa-lg fa-lock align-middle" aria-hidden="true" />
        <span v-if="!$root.onMobile">Снять ограничения данных</span>
      </router-link>
    </b-col>
    <b-col cols="8" md="8" class="text-center">
      Загружено <span class="count">{{ count }}</span> событий
      <span v-if="count && !$root.onMobile">({{ startDate }} — {{ endDate }})</span>
    </b-col>
    <b-col cols="2" md="2">
      <div class="pull-right">
        <ModalMap />
      </div>
    </b-col>
  </b-row>
</template>

<script>
  import ModalMap from '@/components/maps/ModalMap'
  export default {
    props: ['count', 'startDate', 'endDate'],
    components: { ModalMap }
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
