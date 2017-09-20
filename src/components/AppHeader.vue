<template>
    <header id="header">
      <b-row class="align-items-center">
        <b-col class="align-items-center d-flex justify-content-end">
          <router-link to="mainpage" alt="eqalert.ru" class="mr-auto">
            <img src="../assets/img/logos/eqalert-beta.png">
          </router-link>

          <router-link to="events">
            <span id="events-count">
              <span class="exclamation-mark">!</span>
              <span>{{ eventsCount }}</span>
            </span>
          </router-link>
        </b-col>

        <b-col class="did-you-feel-it text-center">
          <a href="https://goo.gl/forms/Hd4E0BcA2ffRNjfY2" target="_blank">
            Ощутили землетрясение?
          </a>
        </b-col>

        <b-col class="align-items-center d-flex justify-content-end">
          <span class="mr-auto" id="page-links">
            <router-link to="events">Тензор момента</router-link>
            <router-link to="events">Аналитика</router-link>
          </span>

          <router-link to="events">
            Войти
            <icon name="long-arrow-right" class="align-middle" />
          </router-link>
        </b-col>
      </b-row>
    </header>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/long-arrow-right'

export default {
  name: 'app-header',
  components: { Icon },
  data () {
    return {
      eventsCount: 0
    }
  },
  methods: {
    fetchEventsCount: function () {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/68aaa3ec79647d0599287f735b288e2c/raw/c4cacd8582cd9de2ab7e423f7fa2f4cb93d165ae/fake.json')
      .then(response => {
        this.eventsCount = response.data.events.length
      })
      .catch(e => { this.errors.push(e) })
    }
  },
  created () {
    return this.fetchEventsCount()
  },
  mounted () {
    setInterval(() => {
      this.fetchEventsCount()
    }, 30000)
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/scss/global.scss';

  #header {
    padding-top: 15px;
    padding-bottom: 15px;

    #page-links {
      a:first-child {
        border-right: 1px solid $color-gray-light;
        padding-right: 5px;
      }
    }
  }

  a {
    color: $color-black;
    font-size: 90%;
  }

  .did-you-feel-it {
    a {
      color: $color-orange;
      font-weight: bold;
    }
  }

  .exclamation-mark {
    color: $color-orange;
    font-weight: bold;
  }

</style>

