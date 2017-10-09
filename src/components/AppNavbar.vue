<template>
    <nav id="navbar">
  		<b-navbar>
	  	  <b-nav justified>
	  	  	<b-nav-item to="events">Все землетрясения</b-nav-item>
	  	  	<b-nav-item to="events">Сеть станций</b-nav-item>
	  	  	<b-nav-item to="events">Мониторинг объектов</b-nav-item>
	  	  	<b-nav-item :to="{ name: 'StaticPage', params: { page: 'about' } }">О сервисе</b-nav-item>
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
  @import '../assets/scss/global.scss';

  $border-bottom-blue: 3px solid $color-blue;
  $border-bottom-orange: 3px solid $color-orange;


  #navbar {
  	background-color: $color-blue;
  	border-color: $color-gray;
    border-radius: 4px;

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
    	border-bottom: $border-bottom-blue;
    	transition: border-bottom 0.30s ease 0s;
  	}

  	li:hover {
    	border-bottom: $border-bottom-orange;
  	}
  }

  .active {
    border-bottom: $border-bottom-orange;
  }
</style>

