<template>
  <b-tabs>
    <template slot="tabs">
      <b-nav-item
        v-if="!$root.onMobile && isTabAvailable(tab)"
        v-for="tab in tabs"
        :href="tab.href"
        :key="tab.href"
        :active="isTabActive(tab)"
        @click="onTabSwitch(tab)">
        {{ tab.label }}
      </b-nav-item>

    <b-form-select
      v-if="$root.onMobile"
      v-model="activeTab"
      @change="onTabSwitch">
        <option
          v-if="isTabAvailable(tab)"
          v-for="tab in tabs"
          :value="tab.href"
          :key="tab.href">
            {{ tab.label }}
        </option>
    </b-form-select>
    </template>
  </b-tabs>
</template>

<script>
  import { round } from '@/helpers/math'
  import eventTabs from '@/data/event-tabs'

  export default {
    props: ['event'],
    data() {
      return {
        activeTab: '#' + this.$router.currentRoute.fullPath,
        tabs: eventTabs
      }
    },
    metaInfo() {
      return {
        title: this.getTitle()
      }
    },
    methods: {
      convertTabName: function(tab)
      {
        if (!tab) {
          return (!this.$root.onMobile || !this.tabs.settlements.available)
            ? 'generalInformation' : 'settlements'
        }

        if (tab === 'moment-tensor') return 'momentTensor'
        return tab
      },
      currentTabName: function() {
        const currentTab = Object.keys(this.tabs).find(key => {
          return this.isTabActive(this.tabs[key])
        })

        return currentTab
          ? this.tabs[currentTab].label
          : 'Информация о событии'
      },
      isTabActive: function(tab) {
        return this.activeTab === tab.href
      },
      isTabAvailable: function(tab) {
        // Add user access rights here in the future.
        return tab.available
      },
      getHref: function(tab) {
        let params = { id: this.event.id }
        let query = { backUrlQuery: this.$route.query.backUrlQuery || '{}' }

        if (tab) params.tab = tab

        return this.$router.resolve({ name: 'Event', params, query }).href
      },
      getTitle: function() {
        const id = this.event.id
        const magnitude = `Землетрясение M${this.event.magnitude}`
        let settlement = ``

        if (this.event.nearestCity) {
          const distance = round(this.event.nearestCity.data.ep_dis, 2)
          const title = this.event.nearestCity.data.settlement.data.translation.data.title
          const region = this.event.nearestCity.data.settlement.data.translation.data.region
          settlement = `| ${distance} км до ${title}, ${region}`
        }

        return `${magnitude} ${settlement} | ${this.currentTabName()} | ${id}`
      },
      onTabSwitch: function(object) {
        const href = typeof object === 'string' ? object : object.href
        const tab = Object.keys(this.tabs).find(key => this.tabs[key].href === href)

        this.setActiveTab(tab)

        // Send event back to the parent component.
        this.$emit('onTabSwitch', tab)
      },
      setActiveTab: function(tab = this.$router.currentRoute.params.tab) {
        this.activeTab = this.tabs[this.convertTabName(tab)].href
      },
      setAvailability: function()
      {
        // Ближайшие населенные пункты
        this.tabs.settlements.available = this.event.has_cities_msk64_analysis

        // Здания и сооружения
        this.tabs.buildings.available = this.event.has_buildings_msk64_analysis

        // Тензор момента
        this.tabs.momentTensor.available = this.event.has_mt

        // Линейные объекты
        this.tabs.ldos.available = this.event.has_long_distance_objects_analysis
      },
      setData: function() {
        this.setAvailability()
        this.setHrefs()

        this.setActiveTab()
      },
      setHrefs: function() {
        this.tabs.buildings.href = this.getHref('buildings')
        this.tabs.generalInformation.href = this.getHref()
        this.tabs.ldos.href = this.getHref('ldos')
        this.tabs.momentTensor.href = this.getHref('moment-tensor')
        this.tabs.settlements.href = this.getHref('settlements')
      }
    },
    created() {
      this.setData()
    },
    watch: {
      event: function() {
        this.setData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tabs {
    padding-bottom: 2%;

    /deep/ .nav-tabs {
      outline: none;
      justify-content: center;

      .nav-item{
        a {
          font-size: 90%;
        }
      }
    }
  }
</style>
