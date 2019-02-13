<template>
  <div class="sign-in">
    <b-row class="breadcrumbs" no-gutters>
      <b-col cols="12">
        <b-breadcrumb :items="breadcrumbs" />
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="6" offset="3">
        <b-form class="sign-in-form"
                ref="form"
                @keyup.enter="onSubmit"
                :validated="form.validated"
                novalidate>
          <b-form-group>
            <b-form-input type="email"
                          :disabled="form.fields.email.disabled"
                          :state="form.fields.email.state"
                          v-model="form.fields.email.value"
                          maxlength="150"
                          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                          placeholder="Электронная почта"
                          required>
            </b-form-input>
            <b-form-invalid-feedback>{{ form.messages.email }}</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group>
            <b-form-input type="password"
                          :disabled="form.fields.password.disabled"
                          :state="form.fields.password.state"
                          v-model="form.fields.password.value"
                          placeholder="Пароль"
                          minlength="6"
                          maxlength="150"
                          required>
            </b-form-input>
            <b-form-invalid-feedback>{{ form.messages.password }}</b-form-invalid-feedback>
          </b-form-group>
        </b-form>

        <b-form-group>
          <b-form-checkbox v-model="form.fields.rememberMe.value">Запомнить меня</b-form-checkbox>

          <router-link :to="{ name: 'UserResetPassword' }" key="reset-password" class="reset-password-link">
            Сбросить пароль
          </router-link>
        </b-form-group>

        <b-button type="submit"
                  variant="send-request"
                  :disabled="form.submitButtonDisabled"
                  v-on:click="onSubmit">
                  Войти
        </b-button>

        <div class="registration-block">
          <router-link :to="{ name: 'UserRegistration' }" key="registration">
            Зарегистрироваться
          </router-link>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import apiSettings from '@/settings/api'
  export default {
    data() {
      return {
        breadcrumbs: [
          {
            text: 'Главная',
            href: this.$router.resolve({ name: 'Mainpage' }).href
          }, {
            text: 'Вход',
            active: true
          }
        ],
        form: {
          fields: {
            email: { value: '', disabled: false, state: null },
            password: { value: '', disabled: false, state: null },
            rememberMe: { value: '', disabled: false }
          },
          messages: {
            email: 'Некорректная электронная почта',
            password: 'Некорректный пароль'
          },
          submitButtonDisabled: false,
          validated: false
        },
        redirectTo: '/',
        validationError: ''
      }
    },
    metaInfo: {
      title: 'Вход'
    },
    methods: {
      enableFields: function() {
        this.changeFieldsDisabledState(false)
      },
      changeFieldsDisabledState: function(state) {
        Object.keys(this.form.fields).forEach(key => {
          this.form.fields[key].disabled = state
        })

        this.form.submitButtonDisabled = state
      },
      disableFields: function() {
        this.changeFieldsDisabledState(true)
      },
      onSubmit: function() {
        this.form.validated = true

        if (!this.$refs.form.checkValidity()) return

        const payload = {
          password: this.form.fields.password.value,
          username: this.form.fields.email.value
        }

        this.disableFields()

        this.$http.post(this.$root.$options.settings.api.endpointUserAuthentication, payload)
          .then(response => {

            this.$http.get(this.$root.$options.settings.api.endpointUserRefreshScopes, {
              headers: { Authorization: `${apiSettings.authorizationType} ${response.data.access_token}` }
            })
              .then(scopesResponse => {

                let permissions = {}

                scopesResponse.data.data.forEach(permission => {
                  permissions[permission.id] = permission.description
                })

                this.$store.dispatch('authenticateUser', {
                  accessToken: response.data.access_token,
                  refreshToken: response.data.refresh_token,
                  rememberMe: this.form.fields.rememberMe.value,
                  permissions: permissions
                })

                this.$toasted.success(`Добро пожаловать!`, { icon: 'check' })
                this.$router.push(this.redirectTo)

              })
              .catch(error => {
                console.log(error)
              })
          })
          .catch(error => {
            if (error.response) {
              this.$toasted.error(`${error.response.data.error.message}`, { icon: 'times' })

              this.enableFields()
            } else {
              console.log(error)
            }
          })
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        if (from.meta.redirectable) vm.redirectTo = from.path
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import '~scss/_variables';

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

  .validation-error {
    color: red;
    text-align: center;
  }

  .sign-in-form {
    border-bottom: 1px solid $color-gray-light;
    padding-bottom: 3%;
    margin-bottom: 3%;
  }

  .btn {
    width: 100%;
  }

  .btn-send-request {
    background-color: $color-blue;
    color: $color-white;
  }

  .reset-password-link {
    float: right;
  }

  .registration-block {
    padding-top: 3%;
    text-align: center;
  }
</style>
