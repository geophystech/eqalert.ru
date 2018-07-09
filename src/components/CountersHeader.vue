<template>
  <b-row class="infobar" align-v="center" no-gutters>
    <b-col>
      <i class="fa fa-lg fa-lock align-middle" aria-hidden="true" />
      <router-link to="/sign-in">Снять ограничения данных</router-link>
    </b-col>
    <b-col cols="8">
      Загружено <span class="count">{{ count }}</span> событий
      <span v-if="count">({{ startDate }} — {{ endDate }})</span>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    props: ['count', 'startDate', 'endDate']
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
    padding-right: 2%;

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
