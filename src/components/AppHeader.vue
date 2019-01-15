<template>
    <header id="header">
      <b-row class="align-items-center">
        <b-col cols="6" md="2" order="1" order-md="1">
          <span id="logo">
            <router-link to="/">
              <img src="../assets/img/logos/eqalert-beta.png" alt="EQA!ert">
            </router-link>
          </span>
        </b-col>

        <b-col cols="6" md="1" class="text-right" order-md="2" v-if="!$root.onMobile">
          <router-link to="events">
            <span id="events-count">
              <span class="exclamation-mark">!</span>
              <span>{{ $store.getters.totalEventsCount }}</span>
            </span>
          </router-link>
        </b-col>

        <b-col class="did-you-feel-it text-center" cols="8" md="4" order="3" order-md="3">
          <a href="https://goo.gl/forms/Hd4E0BcA2ffRNjfY2" target="_blank">
            Ощутили землетрясение?
          </a>
        </b-col>

        <b-col class="social-media-links text-right text-md-center" md="3" cols="6" order="2" order-md="4">
          <a href="tg://resolve?domain=eqalert_ru_bot"><i class="fa fa-telegram" aria-hidden="true" /></a>
        </b-col>

        <b-col class="sign-block text-right" cols="4" md="2" order="5" order-md="5">
          <span class="sign-in-out" v-if="$store.getters.user.authenticated">
            <a href="javascript:void(0)" v-on:click="signOut" key="sign-out">
              Выйти
              <i class="fa fa-times"></i>
            </a>
          </span>
          <span class="sign-in-out" v-else>
            <router-link :to="{ name: 'UserAuthentication' }" key="sign-in">
              Войти
              <i class="fa fa-long-arrow-right align-middle" aria-hidden="true" />
            </router-link>
          </span>
        </b-col>
      </b-row>
    </header>
</template>

<script>
  export default {
    methods: {
      signOut: function() {
        this.$toasted.success(`Вы вышли из сайта`, { icon: 'check' })
        this.$store.dispatch('signOut')
        this.$router.go()
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import '~scss/_variables';

  #header {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  a {
    color: $color-gray-dark;
    font-size: 90%;
  }

  .did-you-feel-it {
    @media screen and (max-width: 767px) {
      font-size: 90%;
      margin-top: 5%;
      text-align: left !important;
    }

    a {
      color: $color-orange;
      font-weight: bold;
    }
  }

  .exclamation-mark {
    color: $color-orange;
    font-weight: bold;
  }

  .sign-block {
    @media screen and (max-width: 767px) {
      margin-top: 5%;
    }
  }

  .social-media-links {
    a {
      font-size: 120%;
    }
  }
</style>

