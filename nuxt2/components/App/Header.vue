<template>
  <header id="header">
    <b-row class="align-items-center">
      <b-col cols="6" md="2" order="1" order-md="1">
          <span id="logo">
            <NuxtLink to="/">
              <img src="/img/logos/eqalert-beta.png" alt="EQA!ert">
            </NuxtLink>
          </span>
      </b-col>

      <b-col cols="6" md="1" class="text-right" order-md="2" v-if="!$onMobile">
        <NuxtLink :to="{ name: 'events' }">
            <span id="events-count">
              <span class="exclamation-mark">!</span>
              <span>{{ $store.getters['app/totalEventsCount'] }}</span>
            </span>
        </NuxtLink>
      </b-col>

      <b-col class="did-you-feel-it text-center" cols="8" md="4" order="3" order-md="3">
        <NuxtLink to="/felt-report">
          Ощутили землетрясение?
        </NuxtLink>
      </b-col>

      <b-col class="text-right text-md-center" md="3" cols="6" order="2" order-md="4">
        <AppSocialMediaLinks />
      </b-col>

      <b-col class="sign-block text-right" cols="4" md="2" order="5" order-md="5">
          <span class="sign-in-out" v-if="$store.getters['user/user'].authenticated">
            <a href="#" v-on:click.prevent="signOut" key="sign-out" data-btn="sign-out">
              Выйти <i class="fa fa-times" />
            </a>
          </span>
        <span class="sign-in-out" v-else>
            <NuxtLink to="/sign-in" key="sign-in">
              Войти <i class="fa fa-long-arrow-right align-middle" aria-hidden="true" />
            </NuxtLink>
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
      this.$store.dispatch('user/signOut')
      this.$router.replace({ name: this.$route.name })
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/_variables';

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
</style>
