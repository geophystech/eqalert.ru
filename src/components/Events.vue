<template>
  <div class="events">
    <b-row class="infobar" align-v="center" no-gutters>
      <b-col>
        <i class="fa fa-lg fa-lock align-middle" aria-hidden="true" />
        <router-link to="/">Снять ограничения данных</router-link>
      </b-col>
      <b-col cols="8">Загружено <span class="events-count">10</span> событий (04.09.2017 — 08.10.2017)</b-col>
    </b-row>

    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
  @import '../assets/scss/global.scss';

  .events {
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

      .events-count {
        color: $color-blue;
        font-weight: bold;
      }
    }
  }

</style>
