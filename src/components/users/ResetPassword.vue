<template>
  <div class="reset">
    <b-row class="breadcrumbs" no-gutters>
      <b-col cols="12">
        <b-breadcrumb :items="breadcrumbs" />
      </b-col>
    </b-row>

    <b-row v-if="resetComplete">
      <b-col class="complete" cols="8" offset="2" align="center">
        <h5>Готово!</h5>
        <p>На указанный электронный адрес отправлено письмо. </p>
        <p>Вам осталось только открыть это письмо и нажать на кнопку "Сменить пароль".</p>
      </b-col>
    </b-row>

    <b-row v-if="!resetComplete">
      <b-col cols="6" offset="3">
        <div class="validation-error">{{ validationError }}</div>

        <b-form class="reset-form"
                @submit.prevent="onSubmit"
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
                          name="email"
                          required>
            </b-form-input>
            <b-form-invalid-feedback>{{ form.messages.email }}</b-form-invalid-feedback>
          </b-form-group>

          <b-button type="submit"
                    variant="send-request"
                    :disabled="form.submitButtonDisabled">
                    Сбросить пароль
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
            text: 'Сбросить пароль',
            active: true
          }
        ],
        form: {
          fields: {
            email: { value: '', disabled: false, state: null }
          },
          messages: {
            email: 'Некорректная электронная почта'
          },
          submitButtonDisabled: false,
          validated: false
        },
        resetComplete: false,
        validationError: ''
      }
    },
    metaInfo: {
      title: 'Сбросить пароль'
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
          email: this.form.fields.email.value
        }

        this.disableFields()

        this.$http.post(apiSettings.endpointUserResetPassword, payload)
          .then(response => {
            this.resetComplete = true
          })
          .catch(error => {
            if (error.response) {
              this.validationError = error.response.data.errors.data.email[0]

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
