<template>
  <form class="filters col-3" @submit="formSend" @reset="resetFields(true)">
    <div class="filter-rows">
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">Магнитуда</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.mag_min" placeholder="2.5" :state="modelState('mag_min')"
                              @input.native="onFiltersChange($event, 'mag_min')" autocomplete="off"
                              :disabled="disabled" />
              </b-input-group>
            </b-col>
            <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.mag_max" placeholder="10.0" :state="modelState('mag_max')"
                              @input.native="onFiltersChange($event, 'mag_max')" autocomplete="off"
                              :disabled="disabled"/>
              </b-input-group>
            </b-col>
          </b-row>
          <div class="text-error" v-show="errors.mag_min" v-html="errors.mag_min"></div>
          <div class="text-error" v-show="errors.mag_max" v-html="errors.mag_max"></div>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">Широта</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.lat_min" placeholder="51.1" :state="modelState('lat_min')"
                              @input.native="onFiltersChange($event, 'lat_min')" autocomplete="off"
                              :disabled="disabled"/>
              </b-input-group>
            </b-col>
            <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.lat_max" placeholder="70.1" :state="modelState('lat_max')"
                              @input.native="onFiltersChange($event, 'lat_max')" autocomplete="off"
                              :disabled="disabled"/>
              </b-input-group>
            </b-col>
          </b-row>
          <div class="text-error" v-show="errors.lat_min" v-html="errors.lat_min"></div>
          <div class="text-error" v-show="errors.lat_max" v-html="errors.lat_max"></div>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">Долгота</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.lon_min" placeholder="145.1" :state="modelState('lon_min')"
                              @input.native="onFiltersChange($event, 'lon_min')" autocomplete="off"
                              :disabled="disabled"/>
              </b-input-group>
            </b-col>
            <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.lon_max" placeholder="190.1" :state="modelState('lon_max')"
                              @input.native="onFiltersChange($event, 'lon_max')" autocomplete="off"
                              :disabled="disabled"/>
              </b-input-group>
            </b-col>
          </b-row>
          <div class="text-error" v-show="errors.lon_min" v-html="errors.lon_min"></div>
          <div class="text-error" v-show="errors.lon_max" v-html="errors.lon_max"></div>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">Количество станций</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col>
              <b-input-group prepend="Минимум">
                <b-form-input v-model.number.trim="filters.sta_num_min" placeholder="1" :state="modelState('sta_num_min')"
                              @input.native="onFiltersChange($event, 'sta_num_min')" autocomplete="off"
                              :disabled="disabled"/>
              </b-input-group>
            </b-col>
          </b-row>
          <div class="text-error" v-show="errors.sta_num_min" v-html="errors.sta_num_min"></div>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">Глубина</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.depth_min" placeholder="0" :state="modelState('depth_min')"
                              @input.native="onFiltersChange($event, 'depth_min')" autocomplete="off"
                              :disabled="disabled"/>
              </b-input-group>
            </b-col>
            <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.depth_max" placeholder="10" :state="modelState('depth_max')"
                              @input.native="onFiltersChange($event, 'depth_max')" autocomplete="off"
                              :disabled="disabled"/>
              </b-input-group>
            </b-col>
          </b-row>
          <div class="text-error" v-show="errors.depth_min" v-html="errors.depth_min"></div>
          <div class="text-error" v-show="errors.depth_max" v-html="errors.depth_max"></div>
        </b-col>
      </b-row>
      <b-row class="filter-row datetime-filter" no-gutters>
        <b-col align-self="center">

          <b-row>
            <b-col class="text-center filter-title">Дата и время</b-col>
          </b-row>

          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col>
              <b-input-group prepend="С">
                <flat-pickr
                  v-model.trim="filters.datetime_min"
                  class="form-control datetime-picker"
                  :config="minDatetimeConfig"
                  placeholder="Дата"
                  @input.native="onFiltersChange($event, 'datetime_min')"
                  :state="modelState('datetime_min')"
                  :disabled="disabled"
                />
              </b-input-group>
            </b-col>
          </b-row>

          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col>
              <b-input-group prepend="По">
                <flat-pickr
                  v-model.trim="filters.datetime_max"
                  class="form-control datetime-picker"
                  :config="maxDatetimeConfig"
                  placeholder="Дата"
                  @input.native="onFiltersChange($event, 'datetime_max')"
                  :state="modelState('datetime_max')"
                  :disabled="disabled"
                />
              </b-input-group>
            </b-col>
          </b-row>
          <div class="text-error" v-show="errors.datetime_min" v-html="errors.datetime_min"></div>
          <div class="text-error" v-show="errors.datetime_max" v-html="errors.datetime_max"></div>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">RMS</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col>
              <b-input-group prepend="Максимум">
                <b-form-input v-model.number.trim="filters.rms_max" placeholder="0.9" :state="modelState('rms_max')" />
              </b-input-group>
            </b-col>
          </b-row>
          <div class="text-error" v-show="errors.rms_max" v-html="errors.rms_max"></div>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col>
          <b-row no-gutters class="filter-inputs">
            <b-col>
              <b-form-checkbox
                @change.native="onFiltersChange($event)"
                v-model="filters.has_mt" :disabled="disabled">Только с тензором момента</b-form-checkbox>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col class="text-center">
          <b-button type="reset" size="sm" :disabled="disabled">Сбросить фильтры</b-button>
        </b-col>
      </b-row>
    </div>
    <b-btn type="submit" variant="success" data-btn="send"
           :class="['send-btn', {fade: sendBtnFade}, {hidden: !filtersChanged}]">Применить</b-btn>
  </form>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component'
  import 'flatpickr/dist/flatpickr.css'
  import { Russian } from 'flatpickr/dist/l10n/ru'

  export default {
    components: {
      flatPickr
    },
    props: {
      disabled: false
    },
    data() {
      return {
        filtersChanged: false,
        sendBtnFade: false,
        reseted: false,
        minDatetimeConfig: {},
        maxDatetimeConfig: {},
        datetimeConfig: {
          allowInput: false,
          dateFormat: 'Y-m-d H:i:S',
          defaultDate: null,
          enableTime: true,
          locale: Russian,
          mode: 'single',
          time_24hr: true,
          maxDate: null,
          minDate: null,
          wrap: true
        },
        filters: {
          has_training: null,
          datetime_max: null,
          datetime_min: null,
          depth_max: null,
          depth_min: null,
          has_mt: null,
          mag_max: null,
          mag_min: null,
          lat_max: null,
          lat_min: null,
          lon_max: null,
          lon_min: null,
          rms_max: null,
          sta_num_min: null
        },
        errorMessages: {}
      }
    },
    beforeMount()
    {
      this.minDatetimeConfig = Object.assign({}, this.datetimeConfig)
      this.maxDatetimeConfig = Object.assign({}, this.datetimeConfig)
      this.minDatetimeConfig.defaultDate = this.$moment.utc().subtract(6, 'months').format('YYYY-MM-DD 00:00:00')

      this.parseURL()

      this.minDatetimeConfig.maxDate = this.$moment.utc().format('YYYY-MM-DD 00:00:00')
      this.maxDatetimeConfig.maxDate = this.$moment.utc().format('YYYY-MM-DD 00:00:00')

      if (!this.$store.getters.user.authenticated) {
        this.minDatetimeConfig.minDate = this.minDatetimeConfig.defaultDate
        this.maxDatetimeConfig.minDate = this.minDatetimeConfig.defaultDate
      }

      if (!this.filters.datetime_min) {
        this.filters.datetime_min = this.minDatetimeConfig.defaultDate
        this.maxDatetimeConfig.minDate = this.filters.datetime_min
        this.updateURL()
      }
    },
    mounted()
    {
      this._sendBtn = this.$el.querySelector('[data-btn="send"]')

      this._sendBtn.addEventListener('mouseover', () => {
        if (this._btnHiddenTimer) clearTimeout(this._btnHiddenTimer)
      }, false)

      this._sendBtn.addEventListener('mouseout', () => {
        this._btnHiddenTimer = setTimeout(() => {
          this.filtersChanged = false
        }, 2000)
      }, false)

    },
    watch: {
      $route: function(data) {
        this.parseURL()
      }
    },
    computed: {
      errors: function() {
        return this.errorMessages
      }
    },
    methods: {

      modelState: function(prop)
      {
        return this.errors[prop] ? false : null
      },

      onFiltersChange: function(e, prop = null)
      {
        if (this.reseted) return

        setTimeout(() => {

          if (prop) {
            this.errors[prop] = null
          }

          if (this._btnHiddenTimer) {
            clearTimeout(this._btnHiddenTimer)
          }

          let btnOffsetTop = e.target.getBoundingClientRect().top - this.$el.getBoundingClientRect().top

          if (['checkbox', 'radio'].indexOf(e.target.type) !== -1) {
            btnOffsetTop -= 5
          }

          this._sendBtn.style.top = `${btnOffsetTop.toFixed(2)}px`
          this.filtersChanged = true
          this.sendBtnFade = true

          this._btnHiddenTimer = setTimeout(() => {
            this.filtersChanged = false
          }, 2000)

        }, 10)
      },

      formSend: function(e)
      {
        e.preventDefault()
        this.send()
      },

      send: function()
      {
        this.filtersChanged = false
        this.sendBtnFade = false
        this.updateURL()
      },

      updateURL: function()
      {
        const query = Object.keys(this.filters)
          .filter(key => {
            if (this.filters[key] !== null && this.filters[key] !== '') return key
          })
          .reduce((object, key) => {
            object[key] = this.prepareValue(key, this.filters[key])
            return object
          }, {})

        this.$router.replace({
          name: this.$route.name,
          query: query
        })
      },

      setErrors: function(errors)
      {
        let otherErrors = []

        Object.keys(errors).forEach(prop => {

          let errorList = errors[prop]

          if (prop in this.filters) {
            this.errorMessages[prop] = `<p>${errorList.join('</p><p>')}</p>`
          } else {
            otherErrors.push(`${prop}: ${errorList.join(', ')}`)
          }

        })
      },

      filtersUpdated: function(delay = 500)
      {
        this.filtersChanged = false

        if (this._filtersUpdateTimeout) {
          clearTimeout(this._filtersUpdateTimeout)
        }

        this._filtersUpdateTimeout = setTimeout(() => {

          let convertedFilters = {}

          Object.keys(this.filters).map(key => {
            convertedFilters[key] = this.prepareValue(key, this.filters[key])
          })

          this.$emit('filtersUpdated', convertedFilters)

        }, delay)
      },

      parseURL: function()
      {
        this.resetFields()

        Object.keys(this.$route.query).forEach(key => {
          if (key in this.filters) {
            if (key === 'has_mt' || key === 'datetime_min' || key === 'datetime_max') {
              this.filters[key] = this.prepareValue(key, this.$route.query[key])
            } else {
              this.filters[key] = parseFloat(this.$route.query[key] || 0)
            }
          }
        })

        this.filtersUpdated(0)
      },

      prepareValue: function(key, value)
      {
        switch (value)
        {
          case false:
          case '0':
          case 0:
          case '':
            return null

          case 1:
            return key === 'has_mt' ? true : value

          case '1':
            return true

          case true:
            return 1

          default:
            return value
        }
      },

      resetFields: function(reloadEvents = false)
      {
        this.reseted = true

        setTimeout(() => {
          this.reseted = false
        }, 100)

        Object.keys(this.filters).map(key => {
          this.filters[key] = null
        })

        if (reloadEvents) {
          this.updateURL()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~scss/_variables';

  .filters
  {
    border: 1px solid $color-gray-light-4;
    border-radius: $border-radius;
    margin-right: 3%;

    > .filter-rows
    {
      > .filter-row
      {
        border-bottom: 1px solid $color-gray-light-4;
        padding-bottom: 6%;

        &.datetime-filter
        {
          .row.filter-inputs + .row.filter-inputs {
            margin-top: 10px;
          }

          .input-group {
            .input-group-prepend {
              .input-group-text {
                width: 50px;
              }
            }
          }
        }

        .text-error
        {
          padding: 10px 10px 0;
          line-height: 20px;
          font-size: 14px;

          /deep/ > p {
            margin: 0;
            + p {
              margin-top: 7px;
            }
          }
        }

        .form-control
        {
          &.datetime-picker {
            background-color: white;
          }

          &.is-invalid {
            background-image: none;
          }
        }

        &:nth-last-child(2) {
          padding-top: 6%;
        }

        &:nth-last-child(1) {
          padding-top: 6%;

          .btn {
            box-shadow: none;
          }
        }

        .filter-title {
          font-size: 90%;
          font-weight: bold;
        }

        .filter-inputs
        {
          .input-group {
            height: 80%;

            input {
              text-align: center;
            }
          }

          // Left input.
          .col-5:first-child,
          .col:first-child {
            padding-left: 3%
          }

          // Arrows.
          .middle-col {
            color: $color-gray-light-2;
          }

          // Right input.
          .col-5:last-child,
          .col:last-child {
            padding-right: 3%
          }

          &:last-child {
            label {
              margin-bottom: 0;
            }
          }
        }

        .row:first-child {
          margin-bottom: 4%;
          margin-top: 4%;
        }

        .input-group-addon {
          background-color: $color-white-2;
          font-size: 80%;
        }

        .custom-checkbox
        {
          width: 100%;

          .custom-control-indicator {
            box-shadow: none;
            height: 22px;
            top: 1px;
            width: 22px;
          }

          .custom-control-description {
            margin-left: 3%;
          }

          .custom-control-input ~ .custom-control-indicator {
            border: 1px solid $color-gray-light-4;
          }

          .custom-control-input:checked ~ .custom-control-indicator {
            background-color: $color-blue;
          }

          .custom-control-input:checked ~ .custom-control-description {
            font-weight: bold;
          }

          .custom-control-input:not(:checked) ~ .custom-control-indicator {
            background-color: $color-white;
          }
        }
      }
    }

    > .send-btn {
      box-shadow: 0 0 7px 1px rgba(0,0,0,0.35);
      border: 1px solid #86ec9d;
      margin: -1px 0 0 10px;
      position: absolute;
      z-index: 999;
      left: 100%;
      top: 43px;
    }
  }
</style>

