<template>
  <b-col cols="3" class="filters">
    <div class="filter-rows">
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">Магнитуда</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.magMin" placeholder="2.5"
                              @input.native="onFiltersChange" autocomplete="off" />
              </b-input-group>
              <div class="text-error" v-show="errors.mag_min">{{ errors.magMin }}</div>
            </b-col>
            <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.magMax" placeholder="10.0"
                              @input.native="onFiltersChange" autocomplete="off" />
              </b-input-group>
              <div class="text-error" v-show="errors.mag_max">{{ errors.magMax }}</div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">Широта</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.latMin" placeholder="51.1"
                              @input.native="onFiltersChange" autocomplete="off" />
              </b-input-group>
            </b-col>
            <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.latMax" placeholder="70.1"
                              @input.native="onFiltersChange" autocomplete="off" />
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">Долгота</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.lonMin" placeholder="145.1"
                              @input.native="onFiltersChange" autocomplete="off" />
              </b-input-group>
            </b-col>
            <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.lonMax" placeholder="190.1"
                              @input.native="onFiltersChange" autocomplete="off" />
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">Количество станций</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col>
              <b-input-group prepend="Минимум">
                <b-form-input v-model.number.trim="filters.staNumMin" placeholder="1"
                              @input.native="onFiltersChange" autocomplete="off" />
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">Глубина</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.depthMin" placeholder="0"
                              @input.native="onFiltersChange" autocomplete="off" />
              </b-input-group>
            </b-col>
            <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
            <b-col cols="5">
              <b-input-group>
                <b-form-input v-model.number.trim="filters.depthMax" placeholder="10"
                              @input.native="onFiltersChange" autocomplete="off" />
              </b-input-group>
            </b-col>
          </b-row>
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
                <flat-pickr v-model.trim="filters.datetimeMin"
                            class="form-control datetime-picker"
                            :config="minDatetimeConfig"
                            placeholder="Дата"
                            @input.native="onFiltersChange" />
              </b-input-group>
            </b-col>
          </b-row>

          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col>
              <b-input-group prepend="По">
                <flat-pickr v-model.trim="filters.datetimeMax"
                            class="form-control datetime-picker"
                            :config="maxDatetimeConfig"
                            placeholder="Дата"
                            @input.native="onFiltersChange"/>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col align-self="center">
          <b-row no-gutters><b-col class="text-center filter-title">RMS</b-col></b-row>
          <b-row no-gutters class="filter-inputs" align-v="center">
            <b-col>
              <b-input-group prepend="Максимум">
                <b-form-input v-model.number.trim="filters.rmsMax" placeholder="0.9" />
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col>
          <b-row no-gutters class="filter-inputs">
            <b-col>
              <b-form-checkbox v-model="filters.hasMt" @change="onFiltersChange">Только с тензором момента</b-form-checkbox>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="filter-row" no-gutters>
        <b-col class="text-center">
          <b-button size="sm" :disabled="disabled" @click="resetFields(true)">Сбросить фильтры</b-button>
        </b-col>
      </b-row>
    </div>
    <b-btn type="button" variant="success" data-btn="send"
           :class="['send-btn', 'fade', {hidden: !filtersChanged}]">Применть</b-btn>
  </b-col>
</template>

<script>
  import { camelToUnderscore } from '@/helpers/string'
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
          wrap: true
        },
        filters: {
          has_training: null,
          datetimeMax: null,
          datetimeMin: null,
          depthMax: null,
          depthMin: null,
          hasMt: null,
          magMax: null,
          magMin: null,
          latMax: null,
          latMin: null,
          lonMax: null,
          lonMin: null,
          rmsMax: null,
          staNumMin: null
        },
        errors: {
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
        prepareRegexps: {
          magMin: [val => /^-?\d(\.\d{1,3})?$/.test(val)],
          magMax: [val => /^-?\d(\.\d{1,3})?$/.test(val)],
          latMin: [val => /^-?\d{1,2}(\.\d{1,9})?$/.test(val)],
          latMax: [val => /^-?\d{1,2}(\.\d{1,9})?$/.test(val)],
          lonMin: [val => /^-?\d{1,2}(\.\d{1,9})?$/.test(val)],
          lonMax: [val => /^-?\d{1,2}(\.\d{1,9})?$/.test(val)],
          rmsMax: [val => /^-?\d{1,2}(\.\d)?$/.test(val)]
        }
      }
    },
    beforeMount()
    {
      this.minDatetimeConfig = Object.assign({}, this.datetimeConfig)
      this.maxDatetimeConfig = Object.assign({}, this.datetimeConfig)
      this.minDatetimeConfig.defaultDate = this.$moment.utc().subtract(6, 'months').format('YYYY-MM-DD 00:00:00')

      this.parseURL()

      if (!this.filters.datetimeMin) {
        this.filters.datetimeMin = this.minDatetimeConfig.defaultDate
      }
    },
    mounted()
    {
      this._sendBtn = this.$el.querySelector('[data-btn="send"]')
    },
    watch: {
      $route: function(data) {
        this.parseURL()
      }
    },
    methods: {
      onFiltersChange: function(e)
      {
        if (this._btnHiddenTimer) {
          clearTimeout(this._btnHiddenTimer)
        }

        let btnOffsetTop = e.target.getBoundingClientRect().top - this.$el.getBoundingClientRect().top
        this._sendBtn.style.top = `${btnOffsetTop.toFixed(2)}px`
        this.filtersChanged = true

        this._btnHiddenTimer = setTimeout(() => {
          this.filtersChanged = false
        }, 2000)
      },
      onChangeCalled: function(event) {
        this.filtersUpdated()
      },
      filtersUpdated: function(delay = 500)
      {
        this.filtersChanged = false

        if (this._filtersUpdateTimeout) {
          clearTimeout(this._filtersUpdateTimeout)
        }

        this._filtersUpdateTimeout = setTimeout(() => {

          this.updateURL()
          let convertedFilters = {}

          Object.keys(this.filters).map(key => {
            convertedFilters[camelToUnderscore(key)] = this.prepareValue(key, this.filters[key])
          })

          this.$emit('filtersUpdated', convertedFilters)

        }, delay)
      },
      parseURL: function() {
        this.resetFields()

        Object.keys(this.$route.query).forEach(key => {
          if (key in this.filters) {
            if (key === 'hasMt' || key === 'datetimeMin' || key === 'datetimeMax') {
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
          case 0:
            return null
          case 1:
            return key === 'hasMt' ? true : value
          case '0':
            return null
          case '1':
            return true
          case '':
            return null
          case false:
            return null
          case true:
            return 1
          default:
            /*if (key in this.prepareRegexps
              && this.prepareRegexps[key].map(validator => validator(value)).filter(res => res === false).length
            ) {
              return null
            }*/
            return value
        }
      },
      resetFields: function(reloadEvents = false) {
        Object.keys(this.filters).map(key => {
          this.filters[key] = null
        })

        if (reloadEvents) this.filtersUpdated()
      },
      updateURL: function() {
        const query = Object.keys(this.filters)
          .filter(key => {
            if (this.filters[key] !== null && this.filters[key] !== '') return key
          })
          .reduce((object, key) => {
            object[key] = this.prepareValue(key, this.filters[key])

            return object
          }, {})

        this.$router.replace({ name: this.$route.name, query: query })
      },

      setErrors: function(errors)
      {
        let otherErrors = []

        Object.keys(errors).forEach(prop => {

          let errorList = errors[prop]

          if (prop in this.errors) {
            this.errors[prop] = errorList.join(', ')
          } else {
            otherErrors.push(`${prop}: ${errorList.join(', ')}`)
          }

        })
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

        .form-control.datetime-picker {
          background-color: white;
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

        .filter-inputs {
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

        .custom-checkbox {
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

