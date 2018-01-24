<template>
  <b-tabs>
    <template slot="tabs">
      <b-nav-item
        :active="isTabActive(tabs.generalInformation)"
        :href="tabs.generalInformation.href"
        @click="onTabSwitch('generalInformation')">
        {{ tabs.generalInformation.text }}
      </b-nav-item>

      <b-nav-item
        :active="isTabActive(tabs.settlements)"
        :href="tabs.settlements.href"
        @click="onTabSwitch('settlements')">
        {{ tabs.settlements.text }}
      </b-nav-item>

      <b-nav-item
        :active="isTabActive(tabs.buildings)"
        :href="tabs.buildings.href"
        @click="onTabSwitch('buildings')">
        {{ tabs.buildings.text }}
      </b-nav-item>

      <b-nav-item
        :active="isTabActive(tabs.momentTensor)"
        :href="tabs.momentTensor.href"
        @click="onTabSwitch('momentTensor')">
        {{ tabs.momentTensor.text }}
      </b-nav-item>

      <b-nav-item
        :active="isTabActive(tabs.ldos)"
        :href="tabs.ldos.href"
        @click="onTabSwitch('ldos')">
        {{ tabs.ldos.text }}
      </b-nav-item>
    </template>
  </b-tabs>
</template>

<script>
  export default {
    props: ['event'],
    data() {
      return {
        activeTab: '',
        tabs: {
          buildings: {
            href: '#',
            text: 'Здания и сооружения'
          },
          generalInformation: {
            href: '#',
            text: 'Общая информация'
          },
          ldos: {
            href: '#',
            text: 'Магистральные объекты'
          },
          momentTensor: {
            href: '#',
            text: 'Тензор момента'
          },
          settlements: {
            href: '#',
            text: 'Ближайшие населенные пункты'
          }
        }
      }
    },
    methods: {
      isTabActive: function(tab) {
        return this.activeTab === tab.href.substr(1)
      },
      getHref: function(tab = null) {
        let params = { id: this.event.id }

        if (tab) params.tab = tab

        return this.$router.resolve({ name: 'Event', params: params }).href
      },
      onTabSwitch: function(tab) {
        this.setActiveTab(tab)

        // Send event back to the parent component.
        this.$emit('onTabSwitch', tab)
      },
      setActiveTab: function(tab = 'generalInformation') {
        this.activeTab = this.tabs[tab].href.substr(1)
      },
      setData: function() {
        this.tabs.buildings.href = this.getHref('buildings')
        this.tabs.generalInformation.href = this.getHref()
        this.tabs.ldos.href = this.getHref('ldos')
        this.tabs.momentTensor.href = this.getHref('moment-tensor')
        this.tabs.settlements.href = this.getHref('settlements')
      }
    },
    created() {
      this.setData()
      this.setActiveTab()
    },
    watch: {
      event: function() {
        this.setData()
        this.setActiveTab()
      }
    }
  }
</script>

<style lang="scss">
  .tabs {
    .nav-tabs {
      justify-content: center;

      .nav-item{
        a {
          font-size: 90%;
        }
      }
    }

    .tab-content {
      padding-top: 2%;
    }
  }
</style>
