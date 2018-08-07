<template>
  <b-col class="filters" cols="3">
    <b-row class="filter" no-gutters>
      <b-col align-self="center">
        <b-row no-gutters><b-col class="text-center filter-title">Магнитуда</b-col></b-row>
        <b-row no-gutters class="filter-inputs" align-v="center">
          <b-col cols="5">
            <b-input-group left="От">
              <b-form-input v-model.number.trim="filters.magMin" placeholder="2.5" :disabled="disabled" @keyup.native="filtersUpdated()" />
            </b-input-group>
          </b-col>
          <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
          <b-col cols="5">
            <b-input-group left="До">
              <b-form-input v-model.number.trim="filters.magMax" placeholder="10.0" :disabled="disabled" @keyup.native="filtersUpdated()" />
            </b-input-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="filter" no-gutters>
      <b-col align-self="center">
        <b-row no-gutters><b-col class="text-center filter-title">Широта</b-col></b-row>
        <b-row no-gutters class="filter-inputs" align-v="center">
          <b-col cols="5">
            <b-input-group left="От">
              <b-form-input v-model.number.trim="filters.latMin" placeholder="51.1" :disabled="disabled" @keyup.native="filtersUpdated()" />
            </b-input-group>
          </b-col>
          <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
          <b-col cols="5">
            <b-input-group left="До">
              <b-form-input v-model.number.trim="filters.latMax" placeholder="70.1" :disabled="disabled" @keyup.native="filtersUpdated()" />
            </b-input-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="filter" no-gutters>
      <b-col align-self="center">
        <b-row no-gutters><b-col class="text-center filter-title">Долгота</b-col></b-row>
        <b-row no-gutters class="filter-inputs" align-v="center">
          <b-col cols="5">
            <b-input-group left="От">
              <b-form-input v-model.number.trim="filters.lonMin" placeholder="145.1" :disabled="disabled" @keyup.native="filtersUpdated()" />
            </b-input-group>
          </b-col>
          <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
          <b-col cols="5">
            <b-input-group left="До">
              <b-form-input v-model.number.trim="filters.lonMax" placeholder="190.1" :disabled="disabled" @keyup.native="filtersUpdated()" />
            </b-input-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="filter" no-gutters>
      <b-col align-self="center">
        <b-row no-gutters><b-col class="text-center filter-title">Количество станций</b-col></b-row>
        <b-row no-gutters class="filter-inputs" align-v="center">
          <b-col>
            <b-input-group left="Минимум">
              <b-form-input v-model.number.trim="filters.staNumMin" placeholder="1" :disabled="disabled" @keyup.native="filtersUpdated()" />
            </b-input-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="filter" no-gutters>
      <b-col align-self="center">
        <b-row no-gutters><b-col class="text-center filter-title">Глубина</b-col></b-row>
        <b-row no-gutters class="filter-inputs" align-v="center">
          <b-col cols="5">
            <b-input-group left="От">
              <b-form-input v-model.number.trim="filters.depthMin" placeholder="0" :disabled="disabled" @keyup.native="filtersUpdated()" />
            </b-input-group>
          </b-col>
          <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
          <b-col cols="5">
            <b-input-group left="До">
              <b-form-input v-model.number.trim="filters.depthMax" placeholder="10" :disabled="disabled" @keyup.native="filtersUpdated()" />
            </b-input-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="filter" no-gutters>
      <b-col align-self="center">
        <b-row no-gutters><b-col class="text-center filter-title">Дата и время</b-col></b-row>
        <b-row no-gutters class="filter-inputs" align-v="center">
          <b-col cols="5">
            <b-input-group left="От">
              <flat-pickr v-model.trim="filters.datetimeMin"
                          class="form-control"
                          :config="datetimeConfig"
                          :disabled="disabled"
                          placeholder="Дата"
                          @on-change="onChangeCalled" />
            </b-input-group>
          </b-col>
          <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
          <b-col cols="5">
            <b-input-group left="До">
              <flat-pickr v-model.trim="filters.datetimeMax"
                          class="form-control"
                          :config="datetimeConfig"
                          :disabled="disabled"
                          placeholder="Дата"
                          @on-change="filtersUpdated()" />
            </b-input-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="filter" no-gutters>
      <b-col align-self="center">
        <b-row no-gutters><b-col class="text-center filter-title">RMS</b-col></b-row>
        <b-row no-gutters class="filter-inputs" align-v="center">
          <b-col>
            <b-input-group left="Максимум">
              <b-form-input v-model.number.trim="filters.rmsMax" placeholder="0.9" :disabled="disabled" @keyup.native="filtersUpdated()" />
            </b-input-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="filter" no-gutters>
      <b-col>
        <b-row no-gutters class="filter-inputs">
          <b-col>
            <b-form-checkbox v-model="filters.hasMt" :disabled="disabled" @change="filtersUpdated()">
              Только с тензором момента
            </b-form-checkbox>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="filter" no-gutters>
      <b-col class="text-center">
        <b-button size="sm" :disabled="disabled" @click="resetFields(true)">Сбросить фильтры</b-button>
      </b-col>
    </b-row>
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
    props: ['disabled'],
    data() {
      return {
        datetimeConfig: {
          allowInput: false,
          dateFormat: 'Y-m-d H:i:S',
          defaultDate: null,
          enableTime: false,
          locale: Russian,
          mode: 'single',
          time_24hr: true,
          wrap: true
        },
        filters: {
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
        }
      }
    },
    beforeMount() {
      this.parseURL()
    },
    watch: {
      $route: function(data) {
        this.parseURL()
      }
    },
    methods: {
      onChangeCalled: function(event) {
        this.filtersUpdated()
      },
      filtersUpdated: function(delay = 300) {
        setTimeout(() => {
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
              this.filters[key] = parseFloat(this.$route.query[key])
            }
          }
        })

        this.filtersUpdated(0)
      },
      prepareValue: function(key, value) {
        switch (value) {
          case 0: return null
          case 1: return key === 'hasMt' ? true : value
          case '0': return null
          case '1': return true
          case '': return null
          case false: return null
          case true: return 1
          default: return value
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~scss/global';

  .filters {
    border: 1px solid $color-gray-light-4;
    border-radius: $border-radius;
    margin-right: 3%;

    .filter {
      border-bottom: 1px solid $color-gray-light-4;
      padding-bottom: 6%;

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
        .col:first-child, {
          padding-left: 3%
        }

        // Arrows.
        .middle-col {
          color: $color-gray-light-2;
        }

        // Right input.
        .col-5:last-child,
        .col:last-child, {
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
</style>

