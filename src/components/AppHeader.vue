<template>
    <header id="header">
      <b-row class="align-items-center">
        <b-col class="align-items-center d-flex justify-content-end">
          <router-link to="/" alt="eqalert.ru" class="mr-auto">
            <img src="../assets/img/logos/eqalert-beta.png" alt="EQA!ert">
          </router-link>

          <router-link to="events">
            <span id="events-count">
              <span class="exclamation-mark">!</span>
              <span>{{ $store.getters.totalEventsCount }}</span>
            </span>
          </router-link>
        </b-col>

        <b-col class="did-you-feel-it text-center">
          <a href="https://goo.gl/forms/Hd4E0BcA2ffRNjfY2" target="_blank">
            Ощутили землетрясение?
          </a>
        </b-col>

        <b-col class="align-items-center d-flex justify-content-end">
          <span class="mr-auto" id="page-links">
            <router-link :to="{ name: 'Events', query: { hasMt: 1 } }" key="events-with-mt">Тензор момента</router-link>
            <router-link :to="{ name: 'Analytics' }" key="analytics">Аналитика</router-link>
          </span>

          <span v-if="$store.getters.user.authenticated">
            <a href="javascript:void(0)" v-on:click="signOut" key="sign-out">
              Выйти
              <i class="fa fa-times"></i>
            </a>
          </span>
          <span v-else>
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
        this.$store.dispatch('signOut')
        this.$router.go()
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import '../assets/scss/global.scss';

  #header {
    padding-top: 15px;
    padding-bottom: 15px;

    #page-links {
      a:first-child {
        border-right: 1px solid $color-gray-light;
        padding-right: 5px;
      }
    }
  }

  a {
    color: $color-black;
    font-size: 90%;
  }

  .did-you-feel-it {
    a {
      color: $color-orange;
      font-weight: bold;
    }
  }

  .exclamation-mark {
    color: $color-orange;
    font-weight: bold;
  }

</style>

