<template>
  <div class="date-time-questions__container">
    <div>
      <b-form-group>
        <v-datetime
          v-model="datetime"
          type="datetime"
          input-id="datetime-input"
          :zone="timezone"
          :value-zone="timezone"
        >
          <legend slot="before" class="col-form-label pt-0">
            Когда вы почувствовали землетрясение? <span style="color: red" title="Обязательный вопрос">*</span>
          </legend>
          <template slot="button-cancel">
            Отмена
          </template>
          <template slot="button-confirm">
            Далее
          </template>
        </v-datetime>
      </b-form-group>
    </div>
    <hr/>
  </div>
</template>

<script>
export default {
  name: 'DateTimeQuestions',
  props: {
    localisation: {
      type: String,
      default: 'ru'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  watch: {
    datetime: function(value) {
      this.formatDatetime(value)
    },
    formattedDatetime: function(value) {
      this.$emit('update', value)
    }
  },
  data() {
    return {
      datetime: null,
      formattedDatetime: null
    }
  },
  methods: {
    formatDatetime: function(value) {
      if (value) {
        this.formattedDatetime = this.$moment(value).utc().format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  mounted() {
    try {
      document.getElementById('datetime-input')
        .setAttribute('placeholder', 'Укажите дату и время')
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style lang="scss">
.date-time-questions__container {
  .form-group {
    legend {
      font-size: 1.25rem;
      font-weight: 700;
    }
    #datetime-input {
      padding: 4px 8px 4px 8px;
      font-size: 1.075rem;
    }

  }
}
</style>
