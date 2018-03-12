<template>
  <div class="sign-in">
    <b-row class="breadcrumbs" no-gutters>
      <b-col cols="12">
        <b-breadcrumb :items="breadcrumbs" />
      </b-col>
    </b-row>

    <b-row>
      <b-col class="sign-in-form" cols="6" offset="3">
        <div class="validation-error">{{ validationError }}</div>

        <b-form @submit.prevent="onSubmit"
                class="text-center"
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

          <b-button type="submit"
                    variant="sign-in"
                    :disabled="form.submitButtonDisabled">
                    Войти
          </b-button>
        </b-form>
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
            text: 'Вход',
            active: true
          }
        ],
        form: {
          fields: {
            email: { value: '', disabled: false, state: null },
            password: { value: '', disabled: false, state: null }
          },
          messages: {
            email: 'Некорректная электронная почта',
            password: 'Некорректный пароль'
          },
          submitButtonDisabled: false,
          validated: false
        },
        validationError: ''
      }
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
          password: this.form.fields.password.value,
          username: this.form.fields.email.value
        }

        this.disableFields()

        this.$http.post(this.$root.$options.settings.api.endpointUserAuthorization, payload)
          .then(response => {
            this.$store.dispatch('authorizeUser', { accessToken: response.data.access_token, refreshToken: response.data.refresh_token })
            this.$router.push('/')
          })
          .catch(error => {
            if (error.response) {
              this.validationError = error.response.data.message

              this.enableFields()
            } else {
              console.log(error)
            }
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

  .validation-error {
    color: red;
    text-align: center;
  }
</style>
