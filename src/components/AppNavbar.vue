<template>
    <nav id="navbar">
      <b-navbar toggleable="md" type="dark">
        <b-navbar-toggle target="nav_collapse">
          <i class="fa fa-navicon" aria-hidden="true" />
        </b-navbar-toggle>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav justified>
            <b-nav-item :to="{ name: 'Events' }" key="events">Все землетрясения</b-nav-item>
            <b-nav-item :to="{ name: 'Analytics' }" key="analytics">Аналитика</b-nav-item>
            <li><a href="https://geophystech.ru/services/seismic-monitoring-system/" class="nav-item nav-link">Мониторинг объектов</a></li>
            <b-nav-item :to="{ name: 'StaticPage', params: { page: 'about' } }" key="static-page-about">О проекте</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
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
    margin: 0;

    @media screen and (max-width: 767px) {
      padding-left: 0;
    }

    @media screen and (min-width: 768px) {
      padding-bottom: 1px;
      padding-top: 8px;
    }

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

  .navbar-toggler {
    border: none;

    // .navbar-toggler-icon {
    // }
  }
</style>

