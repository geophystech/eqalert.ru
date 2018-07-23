<template>
  <div class="mainpage">
    <MainpageMap />

    <b-container>
      <b-row class="partners">
        <b-col>
          <b-row class="d-flex justify-content-center header">
            <h4>Партнёры проекта</h4>
          </b-row>
          <b-row class="d-flex align-items-center">
            <b-col class="text-center" cols="6" md="3">
              <img src="../assets/img/logos/mchs.png" class="img-responsive" id="logo-mchs" alt="МЧС России" />
              <b-tooltip target="logo-mchs" title="МЧС России"></b-tooltip>
            </b-col>

            <b-col class="text-center" cols="6" md="3">
              <img src="../assets/img/logos/sakhalin-government.png" class="img-responsive" id="logo-sakhalin-government" alt="Правительство Сахалинской области" />
              <b-tooltip target="logo-sakhalin-government" title="Правительство Сахалинской области"></b-tooltip>
            </b-col>

            <b-col class="text-center" cols="6" md="3">
              <img src="../assets/img/logos/idg.jpg" class="img-responsive" id="logo-idg" alt="ИДГ РАН" />
              <b-tooltip target="logo-idg" title="ИДГ РАН"></b-tooltip>
            </b-col>

            <b-col class="text-center" cols="6" md="3">
              <img src="../assets/img/logos/vc.png" class="img-responsive" id="logo-vc" alt="ВЦ ДВО РАН" />
              <b-tooltip target="logo-vc" title="ВЦ ДВО РАН"></b-tooltip>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ChartByDatetime from '@/components/charts/ChartByDatetime'
  import ChartByMagnitudeCumulative from '@/components/charts/ChartByMagnitudeCumulative'
  import MainpageMap from '@/components/maps/Mainpage'

  export default {
    components: {
      ChartByDatetime,
      ChartByMagnitudeCumulative,
      MainpageMap
    }
  }
</script>

<style lang="scss" scoped>
  @import '~scss/global';

  $border: 1px $color-gray-light solid;

  .mainpage {
    padding-top: 2%;

    .map {
      height: 700px;
    }

    .events-analytics-block {
      border-top: $border;
      height: auto;
      margin-top: 3%;

      h4 {
        a {
          color: $color-gray-dark;
        }
      }

      .header {
        padding-bottom: 3%;
        padding-top: 3%;
      }
    }

    .partners {
      background-color: $color-gray-light-3;
      border: $border;
      margin-top: 3%;
      padding-bottom: 3%;
      padding-top: 3%;

      .header {
        padding-bottom: 3%;
      }

    @media screen and (max-width: 767px) {
      .col-6:nth-child(3),
      .col-6:nth-child(4) {
        margin-top: 5%;
      }

      #logo-idg {
        max-width: 80%;
      }
    }

    @media screen and (min-width: 768px) {
        img {
          filter: grayscale(100%);

          &:hover {
            filter: grayscale(0%);
          }
        }
      }
    }

    .event {
      border-left: $border;
      border-right: $border;
      border-top: $border;
      padding-bottom: 2%;
      padding-top: 2%;

      &:hover {
        background-color: $color-white-2;
      }

      &:last-child {
        border-bottom: $border;
      }

      .magnitude {
        color: $color-orange;
        font-size: 180%;
      }

      .datetime {
        color: $color-gray-light-2;
        font-size: 85%;
      }

      .moment-tensor {
        img {
          max-width: 100%;
        }
      }

      a {
        color: $color-gray-dark;
        width: 100%;

        &:hover {
          text-decoration: none;
        }
      }
    }
  }
</style>
