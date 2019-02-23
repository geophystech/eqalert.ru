<template>
  <footer class="footer">
  	<b-row no-gutters align-h="center">
      <b-col cols="10" md="4" order="2" order-md="1">
        <b-row no-gutters id="copyright">
          © 2016 &mdash; {{ currentYear }} Eqalert.ru
        </b-row>
        <b-row no-gutters id="feedback">
          <a :href="feedbackUrl">Обратная связь</a>
        </b-row>
      </b-col>

      <b-col cols="12" md="4" order="1" order-md="2" class="text-center" id="geophystech-website">
        <a href="https://geophystech.ru/contacts">ООО "Геофизические технологии"</a>
      </b-col>

      <b-col class="text-right align-self-md-start" cols="2" md="4" order="3" order-md="3" align-self="center">
        <SocialMediaLinks />
      </b-col>

    </b-row>
  </footer>
</template>

<script>
  import AppSettings from '@/settings/app'
  import SocialMediaLinks from '@/components/SocialMediaLinks'
  export default {
    name: 'app-footer',
    components: {SocialMediaLinks},
    data() {
      return {
        feedbackUrl: AppSettings.feedbackUrl
      }
    },
    computed: {
      currentYear: function() {
        return (new Date()).getFullYear()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~scss/_variables';

  .footer {
    padding-bottom: 3%;
    padding-top: 3%;

    a {
      color: $color-gray-dark;
    }

    @media screen and (max-width: 767px) {
      #geophystech-website {
        margin-bottom: 5%;
      }
    }

    /deep/ .social-media-links {
      a {
        font-size: 150%;
      }
    }
  }
</style>
