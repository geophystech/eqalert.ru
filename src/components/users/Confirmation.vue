<template>
  <div class="confirmation">
    <b-row class="breadcrumbs" no-gutters>
      <b-col cols="12">
        <b-breadcrumb :items="breadcrumbs" />
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="8" offset="2" align="center">
        <h5 :class="status">{{ message }}</h5>

        <router-link :to="{ name: 'UserAuthentication' }" key="authentication" v-if="status === 'success'">
          Войти
          <i class="fa fa-long-arrow-right align-middle" aria-hidden="true" />
        </router-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        breadcrumbs: [
          {
            text: 'Главная',
            href: this.$router.resolve({ name: 'Mainpage' }).href
          }, {
            text: 'Подтверждение емэйла',
            active: true
          }
        ],
        message: '',
        status: 'failure'
      }
    },
    created() {
      this.confirmEmail(this.$router.currentRoute.params.token)
    },
    methods: {
      confirmEmail: function(token) {
        this.$http.post(this.$root.$options.settings.api.endpointEmailConfirmation(token))
          .then(response => {
            this.status = 'success'
            this.message = response.data.data
          })
          .catch(error => {
            this.status = 'failure'
            this.message = `Ошибка подтверждения: ${error.response.data.error.message.toLowerCase()}`
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/global';

  .breadcrumbs {
    .breadcrumb {
      background-color: transparent;
      margin-top: 4%;
      padding-left: 0;
      padding-top: 0;

      .active {
        color: $color-gray-dark;
      }
    }
  }

  .failure {
    color: $color-red;
  }

  .success {
    color: $color-green;
  }
</style>
