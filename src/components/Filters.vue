<template>
  <b-col class="filters" cols="3">
    <b-row class="filter" no-gutters>
      <b-col align-self="center">
        <b-row no-gutters><b-col class="text-center filter-title">Магнитуда</b-col></b-row>
        <b-row no-gutters class="filter-inputs" align-v="center">
          <b-col cols="5">
            <b-input-group left="От">
              <b-form-input v-model.trim="filters.magMin" placeholder="2.5" />
            </b-input-group>
          </b-col>
          <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
          <b-col cols="5">
            <b-input-group left="До">
              <b-form-input v-model.trim="filters.magMax" placeholder="10.0" />
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
              <b-form-input v-model.trim="filters.latMin" placeholder="51.1" />
            </b-input-group>
          </b-col>
          <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
          <b-col cols="5">
            <b-input-group left="До">
              <b-form-input v-model.trim="filters.latMax" placeholder="70.1" />
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
              <b-form-input v-model.trim="filters.lonMin" placeholder="145.1" />
            </b-input-group>
          </b-col>
          <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
          <b-col cols="5">
            <b-input-group left="До">
              <b-form-input v-model.trim="filters.lonMax" placeholder="190.1" />
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
              <b-form-input v-model.trim="filters.staNumMin" placeholder="145.1" />
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
              <b-form-input v-model.trim="filters.depthMin" placeholder="0" />
            </b-input-group>
          </b-col>
          <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
          <b-col cols="5">
            <b-input-group left="До">
              <b-form-input v-model.trim="filters.depthMax" placeholder="10" />
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
              <b-form-input v-model.trim="filters.rmsMax" placeholder="145.1" />
            </b-input-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="filter" no-gutters>
      <b-col>
        <b-row no-gutters class="filter-inputs">
          <b-col>
            <b-form-checkbox v-model="filters.hasMt">
              Только с тензором момента
            </b-form-checkbox>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="filter" no-gutters>
      <b-col class="text-center">
        <b-button size="sm">Сбросить фильтры</b-button>
      </b-col>
    </b-row>
  </b-col>
</template>

<script>
  export default {
    data() {
      return {
        filters: {
          depthMax: '',
          depthMin: '',
          hasMt: '',
          magMax: '',
          magMin: '',
          latMax: '',
          latMin: '',
          lonMax: '',
          lonMin: '',
          rmsMax: '',
          staNumMin: ''
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/global.scss';

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

