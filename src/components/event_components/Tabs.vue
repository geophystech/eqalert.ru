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
    data() {
      return {
        activeTab: this.$router.currentRoute.fullPath,
        tabs: {
          buildings: {
            href: this.$router.resolve({ name: 'Event', params: { id: this.$router.currentRoute.params.id, tab: 'buildings' } }).href,
            text: 'Здания и сооружения'
          },
          generalInformation: {
            href: this.$router.resolve({ name: 'Event', params: { id: this.$router.currentRoute.params.id } }).href,
            text: 'Общая информация'
          },
          ldos: {
            href: this.$router.resolve({ name: 'Event', params: { id: this.$router.currentRoute.params.id, tab: 'ldos' } }).href,
            text: 'Магистральные объекты'
          },
          momentTensor: {
            href: this.$router.resolve({ name: 'Event', params: { id: this.$router.currentRoute.params.id, tab: 'moment-tensor' } }).href,
            text: 'Тензор момента'
          },
          settlements: {
            href: this.$router.resolve({ name: 'Event', params: { id: this.$router.currentRoute.params.id, tab: 'settlements' } }).href,
            text: 'Ближайшие населенные пункты'
          }
        }
      }
    },
    methods: {
      isTabActive: function(tab) {
        return this.activeTab === tab.href.substr(1)
      },
      onTabSwitch: function(tab) {
        // Change current active tab.
        this.activeTab = this.tabs[tab].href.substr(1)

        // Send event back to the parent component.
        this.$emit('onTabSwitch', tab)
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
