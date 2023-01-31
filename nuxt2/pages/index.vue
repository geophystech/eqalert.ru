<template>
  <div class="mainpage">
    <BasicLastEvents v-if="$root.onMobile" />
    <BasicMap v-if="!$root.onMobile" />
    <BasicPartners />
  </div>
</template>

<style lang="scss" scoped>
@import 'assets/scss/_variables';

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
