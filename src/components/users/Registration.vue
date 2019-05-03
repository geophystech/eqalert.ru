<template>
  <div class="registration">
    <b-row class="breadcrumbs" no-gutters>
      <b-col cols="12">
        <b-breadcrumb :items="breadcrumbs" />
      </b-col>
    </b-row>

    <b-row v-if="registrationComplete">
      <b-col class="complete" cols="8" offset="2" align="center">
        <h5>Регистрация завершена</h5>
        <p>На указанный электронный адрес отправлено письмо.</p>
        <p>Вам осталось только открыть это письмо и нажать на кнопку "Подтвердить регистрацию".</p>
      </b-col>
    </b-row>

    <b-row v-if="!registrationComplete">
      <b-col class="info" cols="12">
        <h5>Зарегистрированные пользователи <router-link :to="{ name: 'Mainpage' }">eqalert.ru</router-link> получают следующие возможности:</h5>
        <ul>
          <li>Осуществлять поиск по архиву сейсмических событий без ограничений по магнитуде и времени.</li>
          <li>Использовать инструменты экспорта данных в EXCEL.</li>
          <li>Использовать расширенные средства <router-link :to="{ name: 'Analytics' }">статистического анализа и визуализации</router-link>.</li>
          <li>Подписываться на уведомления и сводки по email.</li>
          <li>Участвовать в тестировании новых функций.</li>
        </ul>
      </b-col>
    </b-row>

    <b-row v-if="!registrationComplete">
      <b-col class="registration-form" cols="6" offset="3">
        <b-form @submit.prevent="onSubmit"
                v-if="form.show"
                class="text-center"
                :validated="form.validated"
                novalidate>
          <b-form-group>
            <b-form-input type="email"
                          :disabled="form.fields.email.disabled"
                          :state="form.fields.email.state"
                          v-model="form.fields.email.value"
                          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                          placeholder="Электронная почта"
                          maxlength="150"
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
                          maxlength="150"
                          name="password"
                          minlength="6"
                          required>
            </b-form-input>
            <b-form-invalid-feedback>{{ form.messages.password }}</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group>
            <b-form-input type="text"
                          :disabled="form.fields.company.disabled"
                          :state="form.fields.company.state"
                          v-model="form.fields.company.value"
                          placeholder="Организация"
                          maxlength="150"
                          name="company"
                          required>
            </b-form-input>
            <b-form-invalid-feedback>{{ form.messages.company }}</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group>
            <b-form-select v-model="form.fields.purpose.value"
                           :state="form.fields.purpose.state"
                           :disabled="form.fields.purpose.disabled"
                           :options="form.purposes.values"
                           placeholder="Цель использования расширенных данных"
                           name="purpose"
                           required />
            <b-form-invalid-feedback>{{ form.messages.purpose }}</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group>
            <b-form-input type="text"
                          :disabled="form.fields.fullname.disabled"
                          :state="form.fields.fullname.state"
                          v-model="form.fields.fullname.value"
                          placeholder="Фамилия, имя и отчество"
                          name="fullname"
                          maxlength="150"
                          required>
            </b-form-input>
            <b-form-invalid-feedback>{{ form.messages.fullname }}</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group>
            <a href="javascript:void(0)"
              class="show-additional-info"
              @click.prevent="onShowAdditionalInfo"
              v-show="!form.showAdditionalInfo">
              Указать дополнительную информацию
            </a>

            <b-form-textarea v-model="form.fields.additionalInfo.value"
                             :disabled="form.fields.additionalInfo.disabled"
                             class="additional-info"
                             placeholder="Дополнительная информация"
                             maxlength="2000"
                             name="additionalInfo"
                             v-show="form.showAdditionalInfo">
            </b-form-textarea>
          </b-form-group>

          <b-button type="submit"
                    variant="send-request"
                    :disabled="form.submitButtonDisabled">
                    Зарегистрироваться
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
            text: 'Регистрация',
            active: true
          }
        ],
        form: {
          fields: {
            additionalInfo: { value: '', disabled: false, state: null },
            company: { value: '', disabled: false, state: null },
            email: { value: '', disabled: false, state: null },
            fullname: { value: '', disabled: false, state: null },
            password: { value: '', disabled: false, state: null },
            purpose: { value: null, disabled: false, state: null }
          },
          messages: {
            company: 'Не указана организация',
            email: 'Некорректная электронная почта',
            fullname: 'Не указаны данные',
            password: 'Некорректный пароль',
            purpose: 'Не указана цель'
          },
          purposes: {
            values: [{ value: null, text: 'Цель использования расширенных данных' }],
            disabled: false
          },
          show: true,
          showAdditionalInfo: false,
          submitButtonDisabled: false,
          validated: false
        },
        registrationComplete: false
      }
    },
    created() {
      this.getPurposesList()
    },
    metaInfo: {
      title: 'Регистрация'
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
      getPurposesList: function() {
        this.$http.get(apiSettings.endpointPurposesList)
          .then(response => {
            for (let [id, title] of Object.entries(response.data.data)) {
              this.form.purposes.values.push({ value: id, text: title })
            }
          })
          .catch(error => { console.log(error) })
      },
      onShowAdditionalInfo: function() {
        this.form.showAdditionalInfo = true
      },
      onSubmit: function(event) {
        this.form.validated = true

        if (!event.target.checkValidity()) return

        const payload = {
          additional_info: this.form.fields.additionalInfo.value,
          company_name: this.form.fields.company.value,
          email: this.form.fields.email.value,
          full_name: this.form.fields.fullname.value,
          password: this.form.fields.password.value,
          purpose_of_use: this.form.fields.purpose.value
        }

        this.disableFields()

        this.$http.post(apiSettings.endpointUserRegistration, payload)
          .then(response => {
            this.registrationComplete = true
          })
          .catch(error => {
            if (error.response) {
              this.showValidationErrors(error.response.data.errors.data)

              this.enableFields()
            } else { console.log(error) }
          })
      },
      showValidationErrors: function(messages) {
        Object.keys(messages).forEach(messageKey => {
          const key = this.transformFieldName(messageKey)
          this.form.messages[key] = messages[messageKey][0]
          this.form.fields[key].state = false
        })
      },
      // Transforms field names taken from API into local field names.
      transformFieldName: function(fieldName) {
        switch (fieldName) {
          case 'company_name': return 'company'
          case 'purpose_of_use': return 'purpose'
          case 'full_name': return 'fullname'
          default: return fieldName
        }
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

  .info {
    border-bottom: 1px solid $color-gray-light;
    padding-bottom: 2%;
  }

  .registration-form {
    margin-bottom: 10%;
    margin-top: 4%;

    .show-additional-info {
      border-bottom: 1px dashed $color-blue;

      &:hover {
        text-decoration: none;
      }
    }

    .additional-info {
      height: 250px;
    }

    .btn {
      width: 100%;
    }

    .btn-send-request {
      background-color: $color-blue;
      color: $color-white;
    }
  }
</style>
