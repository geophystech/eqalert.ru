<template>
  <div class="registration">
    <b-row class="breadcrumbs" no-gutters>
      <b-col cols="12">
        <b-breadcrumb :items="breadcrumbs" />
      </b-col>
    </b-row>

    <b-row>
      <b-col class="info" cols="12">
        <h5>Зарегистрированные пользователи <router-link :to="{ name: 'Mainpage' }">eqalert.ru</router-link> получают следующие возможности:</h5>
        <ul>
          <li>Осуществлять поиск по архиву сейсмических событий без ограничений по магнитуде и времени.</li>
          <li>Использовать инструменты экспорта данных в EXCEL, SEISAN.</li>
          <li>Использовать расширенные средства <router-link :to="{ name: 'Analytics' }">статистического анализа и визуализации</router-link>.</li>
          <li>Подписываться на уведомления и сводки по email.</li>
          <li>Участвовать в тестировании новых функций.</li>
        </ul>
      </b-col>
    </b-row>

    <FlashMessage :messages="flash.messages" :status="flash.status" />

    <b-row>
      <b-col class="registration-form" cols="4" offset="4">
        <b-form @submit.prevent="onSubmit" v-if="form.show" class="text-center">
          <b-form-group>
            <b-form-input type="email"
                          v-model="form.email"
                          placeholder="Email"
                          required>
            </b-form-input>
          </b-form-group>

          <b-form-group>
            <b-form-input type="text"
                          v-model="form.company"
                          placeholder="Организация"
                          required>
            </b-form-input>
          </b-form-group>

          <b-form-group>
            <b-form-input type="text"
                          v-model="form.purpose"
                          placeholder="Цель использования расширенных данных"
                          required>
            </b-form-input>
          </b-form-group>

          <b-form-group>
            <b-form-input type="text"
                          v-model="form.fullname"
                          placeholder="Фамилия, имя и отчество"
                          required>
            </b-form-input>
          </b-form-group>

          <b-form-group>
            <a href="javascript:void(0)"
              class="show-additional-info"
              @click.prevent="onShowAdditionalInfo"
              v-show="!form.showAdditionalInfo">
              Указать дополнительную информацию
            </a>

            <b-form-textarea v-model="form.additionalInfo"
                             class="additional-info"
                             placeholder="Дополнительная информация"
                             v-show="form.showAdditionalInfo">
            </b-form-textarea>
          </b-form-group>

          <b-button type="submit" variant="send-request">Отправить запрос</b-button>
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import FlashMessage from '@/components/FlashMessage'

  export default {
    components: { FlashMessage },
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
        flash: {
          messages: [],
          status: ''
        },
        form: {
          additionalInfo: '',
          company: '',
          email: '',
          password: '',
          purpose: '',
          show: true,
          showAdditionalInfo: false,
          fullname: ''
        }
      }
    },
    methods: {
      onShowAdditionalInfo: function() {
        this.form.showAdditionalInfo = true
      },
      onSubmit: function() {
        const payload = {
          additional_info: this.form.additionalInfo,
          company_name: this.form.company,
          email: this.form.email,
          full_name: this.form.fullname,
          password: this.form.password,
          purpose_of_use: this.form.purpose
        }

        this.$http.post(this.$root.$options.settings.api.endpointUserRegistration, payload)
          .then(response => { console.log(response) })
          .catch(error => {
            if (error.response) {
              this.flash.messages = []
              const messages = error.response.data.errors.data

              // Pass error messages to the FlashMessage.
              Object.keys(messages).forEach(key => {
                this.flash.messages.push(messages[key][0])
                this.flash.status = 'error'
              })
            } else { console.log(error) }
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
