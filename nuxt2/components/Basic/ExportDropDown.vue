<template>
  <b-dropdown v-if="$store.getters['user/user'].authenticated && 'xls_access' in $store.getters['user/user'].permissions"
              text="Скачать" size="sm" variant="secondary" @hide="onHide"
              ref="dropdown" right>
    <b-dropdown-item @click="xlsItemClick">
      Скачать в формате XLS
      <ClientOnly>
        <Spinner size="21" v-if="xlsSpinnerShow" class="dropdown-item-spiner" />
      </ClientOnly>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
  export default {
    name: 'ExportDropDown',
    components: {
      Spinner: () => (process.client) ? import('@/components/Basic/Spinner.vue') : null,
    },
    props: {},
    data() {
      return {
        xlsSpinnerShow: false
      }
    },
    methods: {
      xlsItemClick: function()
      {
        this.xlsSpinnerShow = true

        this.$emit('export2xls', (url, params) => {

          this.$axios.get(url, {

            params: Object.assign(Object.assign({}, params), {
              include: 'nearestCity',
              export_to: 'xlsx'
            })

          }).then(response => {

            window.location.href = response.data.data.url
            this.$refs.dropdown.visible = false
            this.xlsSpinnerShow = false

          })

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
