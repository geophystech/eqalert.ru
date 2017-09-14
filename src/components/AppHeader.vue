<template>
    <header id="header">
      <b-row>
        <b-col>
          <router-link to="mainpage" alt="eqalert.ru">
            <img src="../assets/img/logos/eqalert-beta.png">
          </router-link>

          <router-link to="events">
            <span class="exclamation-mark">!</span>
            <span>{{ eventsCount }}</span>
          </router-link>
        </b-col>

        <b-col class="did-you-feel-it">
          <a href="https://goo.gl/forms/Hd4E0BcA2ffRNjfY2" target="_blank">
            Ощутили землетрясение?
          </a>
        </b-col>

        <b-col>
          Тензор момента | Аналитика
        </b-col>

        <b-col>
          Войти
        </b-col>
      </b-row>
    </header>
</template>

<script>
export default {
  name: 'app-header',
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
  @import '../assets/scss/variables.scss';

  .did-you-feel-it {
    a {
      color: $color-orange;
    }
  }

  .exclamation-mark {
    color: $color-orange;
  }

  .col {
    border: 1px solid red;
  }
</style>

