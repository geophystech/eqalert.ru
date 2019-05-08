<template>
  <div class="confirm-password">
    <b-row class="breadcrumbs" no-gutters>
      <b-col cols="12">
        <b-breadcrumb :items="breadcrumbs" />
      </b-col>
    </b-row>

    <b-row v-if="passwordChanged">
      <b-col class="complete" cols="8" offset="2" align="center">
        <h5>Пароль изменён</h5>

        <router-link :to="{ name: 'UserAuthentication' }" key="authentication">
          Войти
          <i class="fa fa-long-arrow-right align-middle" aria-hidden="true" />
        </router-link>
      </b-col>
    </b-row>

    <b-row v-if="!passwordChanged">
      <b-col cols="6" offset="3">
        <div class="validation-error">{{ validationError }}</div>

        <b-form class="confirm-password-form"
                @submit.prevent="onSubmit"
                :validated="form.validated"
                novalidate>

          <b-form-group>
            <b-form-input type="password"
                          :disabled="form.fields.password.disabled"
                          :state="form.fields.password.state"
                          v-model="form.fields.password.value"
                          placeholder="Новый пароль"
                          name="password"
                          maxlength="150"
                          minlength="6"
                          required>
            </b-form-input>
            <b-form-invalid-feedback>{{ form.messages.password }}</b-form-invalid-feedback>
          </b-form-group>

          <b-button type="submit"
                    variant="send-request"
                    :disabled="form.submitButtonDisabled">
                    Сменить пароль
          </b-button>
        </b-form>
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
            text: 'Смена пароля',
            active: true
          }
        ],
        email: null,
        form: {
          fields: {
            password: {
              value: '',
              disabled: false,
              state: null
            }
          },
          messages: {
            password: 'Некорректный пароль'
          },
          submitButtonDisabled: false,
          validated: false
        },
        passwordChanged: false,
        validationError: ''
      }
    },
    metaInfo: {
      title: 'Смена пароля'
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
      onSubmit: function(event) {
        this.form.validated = true

        if (!event.target.checkValidity()) return

        const payload = {
          token: this.$router.currentRoute.params.token,
          password: this.form.fields.password.value
        }

        this.disableFields()

        this.$http.post(apiSettings.endpointUserResetPasswordComplete, payload)
          .then(response => {
            this.passwordChanged = true
          })
          .catch(error => {
            if (error.response) {
              this.validationError = error.response.data.email[0]
              this.enableFields()
            }
          })
      }
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

  .confirm-password-form {
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
