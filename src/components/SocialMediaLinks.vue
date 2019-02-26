<template>
  <div class="social-media-links">
    <a class="tg-bot-link" :href="tgBotUrl"><i class="fa fa-telegram" aria-hidden="true" /></a>
    <a class="download-icon google-play-icon" :href="googlePlay.url" :title="googlePlay.title" target="_blank">{{ googlePlay.title }}</a>
    <a class="download-icon app-store-icon" :href="appStore.url" :title="appStore.title" target="_blank">{{ appStore.title }}</a>
  </div>
</template>

<script>
  import appSettings from '@/settings/app'
  export default {
    name: 'SocialMediaLinks',
    data() {
      return {
        tgBotUrl: appSettings.tgBotUrl,
        googlePlay: {
          url: appSettings.mobileAppUrls.googlePlay,
          title: 'Скачать для Android из Google Play'
        },
        appStore: {
          url: appSettings.mobileAppUrls.appStore,
          title: 'Скачать для iOs из App Store'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import '~scss/_variables';

  .social-media-links
  {
    display: inline-block;

    > a
    {
      color: $color-gray-dark;
      vertical-align: middle;
      display: inline-block;

      + a {
        margin-left: 2px;
      }

      &.tg-bot-link {
        margin-right: 10px;
        font-size: 150%;
      }

      &.download-icon
      {
        &, &::before {
          background-image: url("../assets/img/mobile-store.svg");
          background-repeat: no-repeat;
          background-size: 210px;
          height: 35px;
        }

        font-size: 0;

        &::before {
          background-position-y: -50px !important;
          transition: opacity 300ms;
          background-color: white;
          border-radius: 4px;
          display: block;
          content: '';
          opacity: 0;
        }

        &:hover::before {
          transition: opacity 300ms;
          opacity: 1;
        }

        &.google-play-icon
        {
          &, &::before {
            background-position: -105px 0px;
            width: 105px;
          }
        }

        &.app-store-icon {
          &, &::before {
            background-position: 0px -1px;
            width: 99px;
          }
        }
      }
    }
  }

</style>
