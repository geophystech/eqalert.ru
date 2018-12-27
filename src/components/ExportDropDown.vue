<template>
  <b-dropdown v-if="$store.getters.user.authenticated && 'xls_access' in $store.getters.user.permissions"
              text="Скачать" size="sm" variant="secondary" @hide="onHide"
              ref="dropdown" right>
    <b-dropdown-item @click="xlsItemClick">
      Скачать в формате XLS <Spinner line-fg-color="#337ab7" :line-size="1" size="21"
                                     v-if="xlsSpinnerShow" class="dropdown-item-spiner" />
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  export default {
    name: 'ExportDropDown',
    props: {},
    data() {
      return {
        xlsSpinnerShow: false
      }
    },
    components: { Spinner },
    methods: {
      xlsItemClick: function()
      {
        this.xlsSpinnerShow = true

        this.$emit('export2xls', (xlsUrl) => {
          this.$refs.dropdown.visible = false
          this.xlsSpinnerShow = false
          window.open(xlsUrl)
        })
      },
      onHide: function(e) {
        !this.xlsSpinnerShow || e.preventDefault()
      }
    }
  }
</script>

<style lang="scss" scoped>

  .dropdown /deep/
  {
    .dropdown-menu.show
    {
      transform: none !important;
      left: auto !important;
      top: 100% !important;
      right: 0 !important;

      .dropdown-item-spiner {
        vertical-align: middle;
        display: inline-block;
        position: relative;
        margin-left: 10px;
        top: -2px;
      }
    }
  }

</style>
