<template>
    <nav id="navbar">
      <b-navbar>
        <b-nav justified>
          <b-nav-item :to="{ name: 'Events' }" key="events">Все землетрясения</b-nav-item>
          <b-nav-item :to="{ name: 'StaticPage', params: { page: 'stations' } }" key="static-page-stations">Сеть станций</b-nav-item>
          <li><a href="https://geophystech.ru/services/seismic-monitoring-system/" class="nav-link">Мониторинг объектов</a></li>
          <b-nav-item :to="{ name: 'StaticPage', params: { page: 'about' } }" key="static-page-about">О сервисе</b-nav-item>
        </b-nav>
      </b-navbar>
    </nav>
</template>

<script>
export default {
  name: 'app-navbar'
}
</script>

<style lang="scss" scoped>
  @import '~scss/global';

  $border-bottom-blue: 3px solid $color-blue;
  $border-bottom-orange: 3px solid $color-orange;


  #navbar {
    background-color: $color-blue;
    border-color: $color-gray;
    border-radius: $border-radius;

    a {
      color: $color-white;
      font-weight: bold;
    }
  }

  .navbar {
    width: 100%;
    padding-bottom: 1px;
    padding-top: 8px;
    margin: 0;

    ul {
      width: 100%;
    }

    li {
      transition: border-bottom 0.30s ease 0s;

      a {
        border-bottom: $border-bottom-blue;
      }
    }

    li:hover {
      a {
        border-bottom: $border-bottom-orange;
      }
    }
  }

  .active {
    border-bottom: $border-bottom-orange !important;
  }
</style>

