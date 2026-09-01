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
                          name="email"
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
                          name="password"
                          required>
            </b-form-input>
            <b-form-invalid-feedback>{{ form.messages.password }}</b-form-invalid-feedback>
          </b-form-group>
        </b-form>

        <b-form-group class="remember-me-group">
          <b-form-checkbox
            v-model="form.fields.rememberMe.value"
            :disabled="form.fields.rememberMe.disabled"
            name="rememberMe"
          >
            Запомнить меня
          </b-form-checkbox>
        </b-form-group>

        <b-form-group class="privacy-consent-group">
          <b-form-checkbox
            v-model="form.fields.personalDataConsent.value"
            :disabled="form.fields.personalDataConsent.disabled"
            name="personalDataConsent"
          >
            Нажимая кнопку «Войти», я даю согласие на обработку своих персональных данных в соответствии с
            Федеральным законом от 27.07.2006 года №152 ФЗ «О персональных данных», на условиях определенных
            <a
              href="https://geophystech.ru/documents/EQALERT_RU_PRIVACY_POLICY.html"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
            >
              Политикой конфиденциальности
            </a>.
          </b-form-checkbox>
        </b-form-group>

        <b-form-group>
          <NuxtLink to="/password/reset" key="reset-password" class="reset-password-link">
            Сбросить пароль
          </NuxtLink>
        </b-form-group>

        <b-button type="submit"
                  variant="send-request"
                  :disabled="isSubmitDisabled"
                  v-on:click="onSubmit">
          Войти
        </b-button>

        <div class="registration-block">
          <NuxtLink to="/register" key="registration">
            Зарегистрироваться
          </NuxtLink>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {auth} from '@/helpers/auth'

export default {
  data() {
    return {
      breadcrumbs: [
        {
          text: 'Главная',
          href: "/"
        }, {
          text: 'Вход',
          active: true
        }
      ],
      form: {
        fields: {
          email: { value: '', disabled: false, state: null },
          password: { value: '', disabled: false, state: null },
          rememberMe: { value: false, disabled: false },
          personalDataConsent: { value: false, disabled: false }
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
  head: {
    title: 'Вход'
  },
  computed: {
    isSubmitDisabled() {
      return this.form.submitButtonDisabled || !this.form.fields.personalDataConsent.value
    },
    redirectTo() {
      return this.$store.state.app.redirectTo
    }
  },
  methods: {
    navigateToRoute() {
      if (this.redirectTo) {
        this.$router.push(this.redirectTo)
        this.$store.commit('app/setRedirectTo', null)
      } else {
        this.$router.push('/')
      }
    },
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
    onSubmit: async function() {
      this.form.validated = true

      if (!this.$refs.form.checkValidity()) return
      if (!this.form.fields.personalDataConsent.value) return

      this.disableFields()

      return await auth({

        rememberMe: this.form.fields.rememberMe.value,
        password: this.form.fields.password.value,
        username: this.form.fields.email.value

      }, this.$store, this.$axios, this.$api).then(response => {

        this.$toasted.success(`Добро пожаловать!`, { icon: 'check' })
        this.navigateToRoute()

      }).catch(error => {

        if (error.response) {
          this.$toasted.error(`${error.response.data.error.message}`, { icon: 'times' })
          this.enableFields()
        } else {
          console.log(error)
        }

      })
    }
  },
  fetch({ from, app, store }) {
    if (from && from.path) {
      const redirectTo = app.router.resolve({
        path: from.path,
        query: from.query
      }).href
      store.commit('app/setRedirectTo', redirectTo)
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

.validation-error {
  color: red;
  text-align: center;
}

.sign-in-form {
  border-bottom: 1px solid $color-gray-light;
  padding-bottom: 3%;
  margin-bottom: 3%;
}

.remember-me-group {
  margin-bottom: 0.5rem;
}

.privacy-consent-group {
  margin-bottom: 1rem;
}

.privacy-consent-group ::v-deep .custom-control-label {
  line-height: 1.4;
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
