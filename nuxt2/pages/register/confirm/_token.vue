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

        <NuxtLink to="/sign-in" key="authentication" v-if="status === 'success'">
          Войти
          <i class="fa fa-long-arrow-right align-middle" aria-hidden="true" />
        </NuxtLink>
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
          href: "/"
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
  head: {
    title: 'Подтверждение емэйла'
  },
  methods: {
    confirmEmail: function(token) {
      this.$axios.post(this.$api.endpointEmailConfirmation(token))
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
@import 'assets/scss/_variables';

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
